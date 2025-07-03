export declare class Complements {
    private static readonly urlPortal;
    /**
     * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o `nfeProc`.
     * @param xmlAssinado XML da NF-e já assinado (string)
     * @param xmlResposta XML da SEFAZ com <protNFe> (string)
     * @returns XML `nfeProc` completo
     */
    static toAuthorize(xmlAssinado: string, xmlResposta: string): string;
    /**
     * Extrai a tag desejada do XML, como <protNFe>...</protNFe>
     */
    private static extractTag;
    /**
     * Extrai a versão da NF-e do XML assinado, ex: versao="4.00"
     */
    private static extractVersao;
    /**
     * Junta as partes no formato correto, com tag raiz `nfeProc` e namespace
     */
    private static join;
}
