import { createOffer, getMongoURI } from '../../shared/helpers/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { FileReaderEventType, TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { ConsoleLogger, ILogger } from '../../shared/libs/logger/index.js';
import { DefaultOfferService, IOfferService, OfferModel } from '../../shared/modules/offer/index.js';
import { DefaultUserService, IUserService, UserModel } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './constants/command.constant.js';
import { CommandName } from './enums/command-name.enum.js';
import { ICommand } from './interfaces/command.interface.js';

export class ImportCommand implements ICommand {
  private readonly _userService: IUserService;
  private readonly _offerService: IOfferService;
  private readonly _databaseClient: IDatabaseClient;
  private readonly _logger: ILogger;
  private _salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this._logger = new ConsoleLogger();
    this._userService = new DefaultUserService(this._logger, UserModel);
    this._offerService = new DefaultOfferService(this._logger, OfferModel);
    this._databaseClient = new MongoDatabaseClient(this._logger);
  }

  public getName(): string {
    return CommandName.Import;
  }

  public async execute(
    fileName: string,
    login: string,
    password: string,
    host: string,
    dbName: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbName);
    this._salt = salt;

    await this._databaseClient.connect(uri);

    const fileReader = new TSVFileReader(fileName.trim());
    fileReader.on(FileReaderEventType.Line, this.onImportedLine);
    fileReader.on(FileReaderEventType.End, this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      this._logger.error(`Can't import data from file: ${fileName}`, error as Error);
    }
  }

  private async onImportedLine(line: string, resolve: () => void): Promise<void> {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number): void {
    this._logger.info(`${count} rows imported`);
    this._databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const user = await this._userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this._salt);

    await this._offerService.create({
      title: offer.title,
      description: offer.description,
      city: offer.city,
      previewImage: offer.previewImage,
      housingImages: offer.housingImages,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      housingType: offer.housingType,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      authorId: user.id,
      coordinates: offer.coordinates
    });
  }
}
