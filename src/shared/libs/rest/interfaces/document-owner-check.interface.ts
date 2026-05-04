export interface IDocumentOwnerCheck {
  getOwnerId(documentId: string): Promise<string | null>;
}
