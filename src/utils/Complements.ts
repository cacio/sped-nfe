export class Complements {
  private static readonly urlPortal = 'http://www.portalfiscal.inf.br/nfe';

  /**
   * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o nfeProc.
   * @param xmlAssinado XML da NF-e já assinado (string)
   * @param xmlResposta XML da SEFAZ com <protNFe> (string)
   * @returns XML nfeProc completo
   */
  public static toAuthorize(xmlAssinado: string, xmlResposta: string): string {
    const protNFe = this.extractTag(xmlResposta, 'protNFe');
    const versao = this.extractVersao(xmlAssinado) || '4.00';

    return this.join(xmlAssinado, protNFe, 'nfeProc', versao);
  }

  /**
   * Junta o XML do evento (cancelamento, carta de correção, etc) com o protocolo da SEFAZ, formando o procEventoNFe.
   * @param xmlEvento XML do evento assinado (string)
   * @param xmlResposta XML da SEFAZ com <retEvento> (string)
   * @returns XML procEventoNFe completo
   */
  public static toProcEvento(xmlEvento: string, xmlResposta: string): string {
    const retEvento = this.extractTag(xmlResposta, 'retEvento');
    const versao = this.extractVersao(xmlEvento) || '1.00';

    return this.join(xmlEvento, retEvento, 'procEventoNFe', versao);
  }

  /**
   * Extrai a tag desejada do XML (ex: <protNFe>...</protNFe>)
   */
  private static extractTag(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'm'));
    if (!match) {
      throw new Error(`Tag <${tag}> não encontrada no XML.`);
    }
    return match[0];
  }

  /**
   * Extrai a versão do XML (ex: versao="4.00" ou versao="1.00")
   */
  private static extractVersao(xml: string): string | null {
    const match = xml.match(/versao="([\d.]+)"/);
    return match ? match[1] : null;
  }

  /**
   * Junta dois blocos XML sob uma tag raiz com a versão e namespace corretos
   */
  private static join(bloco1: string, bloco2: string, root: string, versao: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<${root} versao="${versao}" xmlns="${this.urlPortal}">
${bloco1}
${bloco2}
</${root}>`;
  }
}
