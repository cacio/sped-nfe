export declare class Complements {
    private static readonly urlPortal;
    /**
     * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o nfeProc.
     * @param xmlAssinado XML da NF-e já assinado (string)
     * @param xmlResposta XML da SEFAZ com <protNFe> (string)
     * @returns XML nfeProc completo
     */
    static toAuthorize(xmlAssinado: string, xmlResposta: string): string;
    /**
     * Junta o XML do evento (cancelamento, carta de correção, etc) com o protocolo da SEFAZ, formando o procEventoNFe.
     * @param xmlEvento XML do evento assinado (string)
     * @param xmlResposta XML da SEFAZ com <retEvento> (string)
     * @returns XML procEventoNFe completo
     */
    static toProcEvento(xmlEvento: string, xmlResposta: string): string;
    /**
     * Extrai a tag desejada do XML (ex: <protNFe>...</protNFe>)
     */
    private static extractTag;
    /**
     * Extrai a versão do XML (ex: versao="4.00" ou versao="1.00")
     */
    private static extractVersao;
    /**
     * Junta dois blocos XML sob uma tag raiz com a versão e namespace corretos
     */
    private static join;
}
