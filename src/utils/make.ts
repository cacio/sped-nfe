
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { urlEventos } from "./eventos.js"
import { cUF2UF } from "./extras.js"

//Classe da nota fiscal
class Make {
    #NFe: {
        [key: string]: any;
        infNFe: { [key: string]: any }
    } = {
            "@xmlns": "http://www.portalfiscal.inf.br/nfe",
            infNFe: {
                //"@xmlns": "http://www.portalfiscal.inf.br/nfe",
            }
        };
    #ICMSTot: Record<string, number> = {
        vBC: 0,
        vICMS: 0,
        vICMSDeson: 0,
        vFCP: 0,
        vBCST: 0,
        vST: 0,
        vFCPST: 0,
        vFCPSTRet: 0,
        vProd: 0,
        vFrete: 0,
        vSeg: 0,
        vDesc: 0,
        vII: 0,
        vIPI: 0,
        vIPIDevol: 0,
        vPIS: 0,
        vCOFINS: 0,
        vOutro: 0,
        vNF: 0
    };

    // Totais da Reforma Tributária (IS / IBS / CBS)
    #ReformaTribTot: Record<string, number> = {
        vTotalIS: 0,        // Total do Imposto Seletivo
        vTotalIBS: 0,       // Total do IBS
        vTotalCBS: 0,       // Total do CBS
        vTotalCredPres: 0,  // Total de Créditos Presumidos
        vDifIS: 0,          // Total diferido do IS
        vDifIBS: 0,         // Total diferido do IBS
        vDifCBS: 0,         // Total diferido do CBS
        vMonoIS: 0,         // Total monofásico IS
        vMonoIBS: 0,        // Total monofásico IBS
        vMonoCBS: 0,        // Total monofásico CBS
        vRetIS: 0,          // Total retido IS
        vRetIBS: 0,         // Total retido IBS
        vRetCBS: 0          // Total retido CBS
    };

    formatData(dataUsr = new Date()) {
        const ano = dataUsr.getFullYear();
        const mes = String(dataUsr.getMonth() + 1).padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
        const dia = String(dataUsr.getDate()).padStart(2, '0');
        const horas = String(dataUsr.getHours()).padStart(2, '0');
        const minutos = String(dataUsr.getMinutes()).padStart(2, '0');
        const segundos = String(dataUsr.getSeconds()).padStart(2, '0');
        const fusoHorario = -dataUsr.getTimezoneOffset() / 60; // Obtém o fuso horário em horas
        const formatoISO = `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}${fusoHorario >= 0 ? '+' : '-'}${String(Math.abs(fusoHorario)).padStart(2, '0')}:00`;
        return formatoISO;
    }

    //Optativa
    tagInfNFe(obj: any) {
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe[`@${key}`] = obj[key];
        });
    }

    tagIde(obj: any) {
        this.#NFe.infNFe.ide = new Object();
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.ide[key] = obj[key];
        });
    }

    //Referencimanto de NFe
    tagRefNFe(obj: string | string[]) {
        if (typeof this.#NFe.infNFe.ide.NFref == "undefined") {
            this.#NFe.infNFe.ide.NFref = new Array();
        }
        if (Array.isArray(obj)) { //Array de referenciamento de refNFe
            this.#NFe.infNFe.ide.NFref = obj.map(ref => ({ refNFe: `${ref}` }));
        } else { //String unica de refNFe
            this.#NFe.infNFe.ide.NFref.push({ refNFe: obj });
        }
    }

    tagRefNF(obj: any) {
        if (typeof this.#NFe.infNFe.ide.NFref == "undefined") {
            this.#NFe.infNFe.ide.NFref = new Array();
        }
        this.#NFe.infNFe.ide.NFref.push({ refNF: obj });
    }

    tagRefNFP(obj: any) {
        if (typeof this.#NFe.infNFe.ide.NFref == "undefined") {
            this.#NFe.infNFe.ide.NFref = new Array();
        }
        this.#NFe.infNFe.ide.NFref.push({ refNFP: obj });
    }

    tagRefCTe(obj: any) {
        if (typeof this.#NFe.infNFe.ide.NFref == "undefined") {
            this.#NFe.infNFe.ide.NFref = new Array();
        }
        this.#NFe.infNFe.ide.NFref.push({ refCTe: obj });
    }

    tagRefECF(obj: any) {
        if (typeof this.#NFe.infNFe.ide.NFref == "undefined") {
            this.#NFe.infNFe.ide.NFref = new Array();
        }
        this.#NFe.infNFe.ide.NFref.push({ refECF: obj });
    }

    tagEmit(obj: any) {
        this.#NFe.infNFe.emit = new Object();
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.emit[key] = obj[key];
            if (key == "xFant") {
                this.#NFe.infNFe.emit.enderEmit = {};
            }
        });
    }

    tagEnderEmit(obj: any) {
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.emit.enderEmit[key] = obj[key];
        });
    }

    tagDest(obj: any) {
        this.#NFe.infNFe.dest = {};
        if (this.#NFe.infNFe.ide.tpAmb == 2 && obj['xNome'] !== undefined) obj['xNome'] = "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL";
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.dest[key] = obj[key];
            if (key == "xNome" && this.#NFe.infNFe.ide.mod == 55) {
                this.#NFe.infNFe.dest.enderDest = {};
            }
        });
    }

    tagEnderDest(obj: any) {
        if (this.#NFe.infNFe.ide.mod == 65) return 1;

        this.#NFe.infNFe.dest.enderDest = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.dest.enderDest[key] = obj[key];
        });
    }

    tagRetirada(obj: any) {
        this.#NFe.infNFe.retirada = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.retirada[key] = obj[key];
        });
    }

    tagAutXML(obj: any) {
        if (typeof this.#NFe.infNFe.autXML == "undefined") {
            this.#NFe.infNFe.autXML = new Array();
        }
        this.#NFe.infNFe.autXML.push(obj);
    }

    //tagprod
    async tagProd(obj: any) {
        //Abrir tag de imposto
        for (let cont = 0; cont < obj.length; cont++) {

            if (obj[cont]['@nItem'] === undefined) {
                obj[cont] = { '@nItem': cont + 1, prod: obj[cont], imposto: {} };
            } else {
                obj[cont] = { '@nItem': obj[cont]['@nItem'], prod: obj[cont], imposto: {} };
                delete obj[cont].prod['@nItem'];
            }

            //Primeiro item + NFCe + Homologação
            if (cont == 0 && this.#NFe.infNFe.ide.mod == 65 && this.#NFe.infNFe.ide.tpAmb == 2) obj[cont].prod.xProd = "NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL";

            obj[cont].prod.qCom = (obj[cont].prod.qCom * 1).toFixed(4)
            obj[cont].prod.vUnCom = (obj[cont].prod.vUnCom * 1).toFixed(10)
            obj[cont].prod.vProd = (obj[cont].prod.vProd * 1).toFixed(2)

            if (obj[cont].prod.vDesc !== undefined) obj[cont].prod.vDesc = (obj[cont].prod.vDesc * 1).toFixed(2)

            obj[cont].prod.qTrib = (obj[cont].prod.qTrib * 1).toFixed(4)
            obj[cont].prod.vUnTrib = (obj[cont].prod.vUnTrib * 1).toFixed(10)
            //Calcular ICMSTot
            this.#calICMSTot(obj[cont].prod);
        }
        this.#NFe.infNFe.det = obj;
    }

    tagCreditoPresumidoProd(obj: any) {
        throw "não implementado!";
    }

    taginfAdProd(index: number, obj: any) {
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index][key] = obj[key];
        });
    }

    tagCEST(obj: any) {
        throw "não implementado!";
    }

    tagRECOPI(obj: any) {
        throw "não implementado!";
    }

    tagDI(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].DI === undefined) this.#NFe.infNFe.det[index].DI = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].DI[key] = obj[key];
        });

        //Adicionar ao imposto global
        this.#calICMSTot(obj);
    }

    tagAdi(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].DI === undefined) this.#NFe.infNFe.det[index].DI = {};
        if (this.#NFe.infNFe.det[index].DI.adi === undefined) this.#NFe.infNFe.det[index].DI.adi = {};

        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].DI.adi[key] = obj[key];
        });

        //Adicionar ao imposto global
        this.#calICMSTot(obj);
    }

    tagDetExport(obj: any) {
        throw "não implementado!";
    }

    tagDetExportInd(obj: any) {
        throw "não implementado!";
    }

    tagRastro(obj: any) {
        throw "não implementado!";
    }

    tagVeicProd(obj: any) {
        throw "não implementado!";
    }

    tagMed(obj: any) {
        throw "não implementado!";
    }

    tagArma(obj: any) {
        throw "não implementado!";
    }

    tagComb(obj: any) {
        throw "não implementado!";
    }

    tagEncerrante() {
        throw "não implementado!";
    }

    tagOrigComb() {
        throw "não implementado!";
    }

    tagImposto() {
        throw "não implementado!";
    }

    tagProdICMS(index: number, data: any) {
        if (!this.#NFe?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }

        if (!this.#NFe.infNFe.det[index].imposto) {
            this.#NFe.infNFe.det[index].imposto = {};
        }

        if (!this.#NFe.infNFe.det[index].imposto.ICMS) {
            this.#NFe.infNFe.det[index].imposto.ICMS = {};
        }

        const obj = this.#equalizeICMSParameters(data);

        let keyXML = "";
        switch (obj.CST) {
            case '00':
                keyXML = 'ICMS00';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS00(obj);
                break;
            case '02':
                keyXML = 'ICMS02';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS02(obj);
                break;
            case '10':
                keyXML = 'ICMS10';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS10(obj);
                break;
            case '15':
                keyXML = 'ICMS15';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS15(obj);
                break;
            case '20':
                keyXML = 'ICMS20';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS20(obj);
                break;
            case '30':
                keyXML = 'ICMS30';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS30(obj);
                break;
            case '40':
            case '41':
            case '50':
                keyXML = 'ICMS40';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS40(obj);
                break;
            case '51':
                keyXML = 'ICMS51';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS51(obj);
                break;
            case '53':
                keyXML = 'ICMS53';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS53(obj);
                break;
            case '60':
                keyXML = 'ICMS60';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS60(obj);
                break;
            case '61':
                keyXML = 'ICMS61';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS61(obj);
                break;
            case '70':
                keyXML = 'ICMS70';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS70(obj);
                break;
            case '90':
                keyXML = 'ICMS90';
                this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS90(obj);
                break;
            default:
                throw new Error(`CST inválido: ${obj.CST}`);
        }
    }


    tagProdICMSPart(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.ICMS === undefined) this.#NFe.infNFe.det[index].imposto.ICMS = {};

        this.#NFe.infNFe.det[index].imposto.ICMS.ICMSPart = {};
        Object.keys(obj).forEach(key => {
            if (key != 'orig' && key != 'modBC')
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            this.#NFe.infNFe.det[index].imposto.ICMS.ICMSPart[key] = obj[key];
        });

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    //
    tagProdICMSST(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.ICMS === undefined) this.#NFe.infNFe.det[index].imposto.ICMS = {};
        let CST = obj.CST;
        //delete obj.CST;

        this.#NFe.infNFe.det[index].imposto.ICMS[`ICMS${CST}`] = {};
        Object.keys(obj).forEach(key => {
            if (!["orig", "CSOSN", "modBC", "modBCST"].includes(key))
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            this.#NFe.infNFe.det[index].imposto.ICMS[`ICMS${CST}`][key] = obj[key];
        });

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    //
    tagProdICMSSN(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.ICMS === undefined) this.#NFe.infNFe.det[index].imposto.ICMS = {};

        let keyXML = "";
        switch (obj.CSOSN) {
            case '101':
                keyXML = 'ICMSSN101';
                break;
            case '102':
            case '103':
            case '300':
            case '400':
                keyXML = 'ICMSSN102';
                break;
            case '201':
                keyXML = 'ICMSSN201';
                break;
            case '202':
            case '203':
                keyXML = 'ICMSSN202';
                break;
            case '500':
                keyXML = 'ICMSSN500';
                break;
            case '900':
                keyXML = 'ICMSSN900';
                break;
            default:
                throw "CSOSN não identificado!";
                break;
        }
        this.#NFe.infNFe.det[index].imposto.ICMS[keyXML] = {};
        Object.keys(obj).forEach(key => {
            if (key != 'orig')
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            this.#NFe.infNFe.det[index].imposto.ICMS[keyXML][key] = obj[key];
        });

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }


    tagProdICMSUFDest(index: number, obj: any) {
        console.log(this.#NFe.infNFe.total)
        if (this.#NFe.infNFe.det[index].imposto.ICMSUFDest === undefined) this.#NFe.infNFe.det[index].imposto.ICMSUFDest = {};

        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].imposto.ICMSUFDest[key] = obj[key] == 0 ? "0.00" : obj[key];
        });
        this.#calICMSTot?.(obj); // opcional
    }

    tagProdIPI(index: number, data: any) {
        if (!this.#NFe?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }

        if (!this.#NFe.infNFe.det[index].imposto) {
            this.#NFe.infNFe.det[index].imposto = {};
        }

        if (!this.#NFe.infNFe.det[index].imposto.IPI) {
            this.#NFe.infNFe.det[index].imposto.IPI = {};
        }

        const obj = this.equalizeIPIParameters(data);

        // Campo obrigatório na raiz do IPI
        this.#NFe.infNFe.det[index].imposto.IPI.cEnq = obj.cEnq;

        let keyXML = "";
        let ipiTag: Record<string, any> = {}; // Use um objeto local para construir a tag

        switch (obj.CST) {
            case '00':
            case '49':
            case '50':
            case '99':
                keyXML = 'IPITrib';
                ipiTag = this.generateIPITrib(obj);
                break;
            case '01':
            case '02':
            case '03':
            case '04':
            case '05':
            case '51':
            case '52':
            case '53':
            case '54':
            case '55':
                keyXML = 'IPINT';
                ipiTag = this.generateIPINT(obj);
                break;
            default:
                throw new Error("CST de IPI não identificado!");
        }

        this.#NFe.infNFe.det[index].imposto.IPI[keyXML] = ipiTag;

        // Adicionar campos opcionais na raiz do IPI
        if (obj.clEnq) {
            this.#NFe.infNFe.det[index].imposto.IPI.clEnq = obj.clEnq;
        }
        if (obj.CNPJProd) {
            this.#NFe.infNFe.det[index].imposto.IPI.CNPJProd = obj.CNPJProd;
        }
        if (obj.cSelo) {
            this.#NFe.infNFe.det[index].imposto.IPI.cSelo = obj.cSelo;
        }
        if (obj.qSelo) {
            this.#NFe.infNFe.det[index].imposto.IPI.qSelo = obj.qSelo;
        }

        this.#calICMSTot(obj); // opcional se considerar IPI no total
    }


    tagProdII(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.II === undefined) this.#NFe.infNFe.det[index].imposto.II = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].imposto.II[key] = obj[key];
        });
        this.#calICMSTot(obj);
    }

    tagProdPIS(index: number, data: any) {
        if (!this.#NFe?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }

        if (!this.#NFe.infNFe.det[index].imposto) {
            this.#NFe.infNFe.det[index].imposto = {};
        }

        if (!this.#NFe.infNFe.det[index].imposto.PIS) {
            this.#NFe.infNFe.det[index].imposto.PIS = {};
        }

        const obj = this.#equalizePISParameters(data);

        let keyXML = "";
        let pisItem: Record<string, any> = {};

        switch (obj.CST) {
            case '01':
            case '02':
                keyXML = 'PISAliq';
                pisItem = this.generatePISAliq(obj);
                break;
            case '03':
                keyXML = 'PISQtde';
                pisItem = this.generatePISQtde(obj);
                break;
            case '04':
            case '05':
            case '06':
            case '07':
            case '08':
            case '09':
                keyXML = 'PISNT';
                pisItem = this.generatePISNT(obj);
                break;
            case '49':
            case '50':
            case '51':
            case '52':
            case '53':
            case '54':
            case '55':
            case '56':
            case '60':
            case '61':
            case '62':
            case '63':
            case '64':
            case '65':
            case '66':
            case '67':
            case '70':
            case '71':
            case '72':
            case '73':
            case '74':
            case '75':
            case '98':
            case '99':
                keyXML = 'PISOutr';
                pisItem = this.generatePISOutr(obj);
                break;
            default:
                throw new Error("CST de PIS não identificado!");
        }

        this.#NFe.infNFe.det[index].imposto.PIS[keyXML] = pisItem;

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    tagProdPISST(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.PISST === undefined) this.#NFe.infNFe.det[index].imposto.PISST = {};

        this.#NFe.infNFe.det[index].imposto.PISST = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].imposto.PISST[key] = obj[key];
        });


        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    tagProdCOFINS(index: number, data: any) {
        if (!this.#NFe?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }

        if (!this.#NFe.infNFe.det[index].imposto) {
            this.#NFe.infNFe.det[index].imposto = {};
        }

        if (!this.#NFe.infNFe.det[index].imposto.COFINS) {
            this.#NFe.infNFe.det[index].imposto.COFINS = {};
        }

        const obj = this.equalizeCOFINSParameters(data);

        let keyXML = "";
        let confinsItem: Record<string, any> = {};

        switch (obj.CST) {
            case '01':
            case '02':
                keyXML = 'COFINSAliq';
                confinsItem = this.generateCOFINSAliq(obj);
                break;
            case '03':
                keyXML = 'COFINSQtde';
                confinsItem = this.generateCOFINSQtde(obj);
                break;
            case '04':
            case '05':
            case '06':
            case '07':
            case '08':
            case '09':
                keyXML = 'COFINSNT';
                confinsItem = this.generateCOFINSNT(obj);
                break;
            case '49':
            case '50':
            case '51':
            case '52':
            case '53':
            case '54':
            case '55':
            case '56':
            case '60':
            case '61':
            case '62':
            case '63':
            case '64':
            case '65':
            case '66':
            case '67':
            case '70':
            case '71':
            case '72':
            case '73':
            case '74':
            case '75':
            case '98':
            case '99':
                keyXML = 'COFINSOutr';
                confinsItem = this.generateCOFINSOutr(obj);
                break;
            default:
                throw new Error("CST de COFINS não identificado!");
        }

        this.#NFe.infNFe.det[index].imposto.COFINS[keyXML] = confinsItem;

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    tagProdCOFINSST(index: number, obj: any) {
        if (this.#NFe.infNFe.det[index].imposto.COFINS === undefined) this.#NFe.infNFe.det[index].imposto.COFINS = {};

        this.#NFe.infNFe.det[index].imposto.COFINS.COFINSST = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].imposto.PIS.COFINSST[key] = obj[key];
        });

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    tagProdISSQN(index: number, obj: any) {
        this.#NFe.infNFe.det[index].imposto.ISSQN = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.det[index].imposto.ISSQN[key] = obj[key];
        });

        //Calcular ICMSTot
        this.#calICMSTot(obj);
    }

    tagProdImpostoDevol(index: number, obj: any) {
        throw "Não implementado!";
    }

    tagICMSTot(obj = null) {
        this.#NFe.infNFe.total = {
            ICMSTot: {}
        };
        Object.keys(this.#ICMSTot).forEach(key => {
            this.#NFe.infNFe.total.ICMSTot[key] = (this.#ICMSTot[key] * 1).toFixed(2);
        });
        this.#NFe.infNFe.total.ICMSTot.vNF = (this.#NFe.infNFe.total.ICMSTot.vProd - this.#NFe.infNFe.total.ICMSTot.vDesc).toFixed(2)

        if (obj != null) { // Substituir campos que deseja
            Object.keys(obj).forEach(key => {
                this.#NFe.infNFe.total.ICMSTot[key] = obj[key];
            });
        }
    }

    // Totais da Reforma Tributária
    tagTotaisReformaTributaria(obj?: any) {
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (this.#ReformaTribTot.hasOwnProperty(key)) {
                    this.#ReformaTribTot[key] = obj[key];
                }
            });
        }
        if (!this.#NFe.infNFe.total) this.#NFe.infNFe.total = {};
        this.#NFe.infNFe.total.ReformaTributariaTot = this.#ReformaTribTot;
    }


    tagISSQNTot(obj: any) {
        throw "Não implementado!";
    }

    tagRetTrib(obj: any) {
        throw "Não implementado!";
    }


    tagTransp(obj: any) {
        this.#NFe.infNFe.transp = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.transp[key] = obj[key];
        });
    }

    tagTransporta(obj: any) {
        throw "Não implementado!";
    }

    tagRetTransp(obj: any) {
        throw "Não implementado!";
    }

    tagVeicTransp(obj: any) {
        throw "Não implementado!";
    }

    tagReboque(obj: any) {
        throw "Não implementado!";
    }

    tagVagao(obj: any) {
        throw "Não implementado!";
    }

    tagBalsa(obj: any) {
        throw "Não implementado!";
    }

    tagVol(obj: any) {
        throw "Não implementado!";
    }

    tagLacres(obj: any) {
        throw "Não implementado!";
    }

    tagFat(obj: any) {
        if (!obj) throw new Error("Parâmetro obrigatório para tagFat está vazio");

        const cobr = this.#NFe.infNFe.cobr ??= {}; // Garante que 'cobr' existe
        const fat: Record<string, any> = cobr.fat = {};

        for (const key of ['nFat', 'vOrig', 'vDesc', 'vLiq']) {
            if (['vOrig', 'vDesc', 'vLiq'].includes(key)) {
                fat[key] = Number(obj[key]).toFixed(2);
            } else {
                fat[key] = obj[key];
            }
        }

        return this;
    }

    tagDup(lista: any[]) {
        if (!Array.isArray(lista) || lista.length === 0) {
            throw new Error("Parâmetro obrigatório para tagDup deve ser uma lista não vazia");
        }

        const cobr = this.#NFe.infNFe.cobr ??= {};
        cobr.dup = [];

        for (const dup of lista) {
            if (!dup.nDup || !dup.dVenc || !dup.vDup) {
                throw new Error("Campos obrigatórios em 'dup' ausentes: nDup, dVenc e vDup");
            }

            cobr.dup.push({
                nDup: dup.nDup,
                dVenc: dup.dVenc,
                vDup: Number(dup.vDup).toFixed(2),
            });
        }

        return this;
    }


    //tagpag()
    tagTroco(obj: any) {
        if (this.#NFe.infNFe.pag === undefined) this.#NFe.infNFe.pag = {};
        this.#NFe.infNFe.pag.vTroco = obj;
    }

    tagDetPag(obj: any) {
        if (this.#NFe.infNFe.pag === undefined) this.#NFe.infNFe.pag = {};
        this.#NFe.infNFe.pag.detPag = obj;
    }

    tagIntermed(obj: any) {
        throw "Não implementado!";
    }

    tagInfAdic(obj: any) {
        if (this.#NFe.infNFe.infAdic === undefined) this.#NFe.infNFe.infAdic = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.infAdic[key] = obj[key];
        });
    }

    tagObsCont(obj: any) {
        throw "Não implementado!";
    }

    tagObsFisco(obj: any) {
        throw "Não implementado!";
    }

    tagProcRef(obj: any) {
        throw "Não implementado!";
    }

    tagExporta(obj: any) {
        throw "Não implementado!";
    }

    tagCompra(obj: any) {
        throw "Não implementado!";
    }

    tagCana(obj: any) {
        throw "Não implementado!";
    }

    tagforDia() {

    }

    tagdeduc() {

    }

    taginfNFeSupl() {

    }

    tagInfRespTec(obj: any) {
        if (this.#NFe.infNFe.infRespTec === undefined) this.#NFe.infNFe.infRespTec = {};
        Object.keys(obj).forEach(key => {
            this.#NFe.infNFe.infRespTec[key] = obj[key];
        });
    }



    //Endereço para retirada
    tagRetiEnder(obj: any) {
        throw "Ainda não configurado!";
    }

    //Endereço para entrega
    tagEntrega(obj: any) {
        throw "Ainda não configurado!";
    }

    // Produtos e serviços (com suporte à Reforma Tributária)
    tagDet(obj: any) {
        if (!this.#NFe.infNFe.det) this.#NFe.infNFe.det = [];

        const det: any = { prod: {}, imposto: {} };

        // Produto
        if (obj.prod) {
            Object.keys(obj.prod).forEach(key => {
                det.prod[key] = obj.prod[key];
            });
        }

        // Impostos tradicionais (ICMS/IPI/PIS/COFINS etc.)
        if (obj.imposto) {
            det.imposto = obj.imposto;
        }

        // Imposto Seletivo (IS)
        if (obj.IS) {
            det.imposto.IS = obj.IS;
        }

        // IBS
        if (obj.IBS) {
            det.imposto.IBS = obj.IBS;
        }

        // CBS
        if (obj.CBS) {
            det.imposto.CBS = obj.CBS;
        }

        // Créditos Presumidos
        if (obj.CredPres) {
            det.imposto.CredPres = obj.CredPres;
        }

        // Diferimento
        if (obj.Dif) {
            det.imposto.Dif = obj.Dif;
        }

        // Monofásico
        if (obj.Mono) {
            det.imposto.Mono = obj.Mono;
        }

        // Retenções
        if (obj.Ret) {
            det.imposto.Ret = obj.Ret;
        }

        this.#NFe.infNFe.det.push(det);
    }

    // Calcula totais da Reforma Tributária com base nos itens
    // Calcula totais da Reforma Tributária com base nos itens (compatível com layout SEFAZ)
    calcTotaisReformaTributaria() {
        let ISTot: any = {};
        let IBSCBSTot: any = {};

        if (this.#NFe.infNFe.det) {
            this.#NFe.infNFe.det.forEach((item: any) => {
                if (item.imposto?.IS?.vIS) {
                    ISTot.vTotIS = (Number(ISTot.vTotIS || 0) + Number(item.imposto.IS.vIS)).toFixed(2);
                }
                if (item.imposto?.IBS?.vIBS) {
                    IBSCBSTot.vTotIBS = (Number(IBSCBSTot.vTotIBS || 0) + Number(item.imposto.IBS.vIBS)).toFixed(2);
                }
                if (item.imposto?.CBS?.vCBS) {
                    IBSCBSTot.vTotCBS = (Number(IBSCBSTot.vTotCBS || 0) + Number(item.imposto.CBS.vCBS)).toFixed(2);
                }
                if (item.imposto?.CredPres?.vCredPresIBS) {
                    IBSCBSTot.vTotCredPres = (Number(IBSCBSTot.vTotCredPres || 0) + Number(item.imposto.CredPres.vCredPresIBS)).toFixed(2);
                }
                if (item.imposto?.CredPres?.vCredPresCBS) {
                    IBSCBSTot.vTotCredPres = (Number(IBSCBSTot.vTotCredPres || 0) + Number(item.imposto.CredPres.vCredPresCBS)).toFixed(2);
                }
            });
        }

        if (!this.#NFe.infNFe.total) this.#NFe.infNFe.total = {};
        if (Object.keys(ISTot).length > 0) this.#NFe.infNFe.total.ISTot = ISTot;
        if (Object.keys(IBSCBSTot).length > 0) this.#NFe.infNFe.total.IBSCBSTot = IBSCBSTot;
    }
    //Sistema gera a chave da nota fiscal
    #gerarChaveNFe() {
        const chaveSemDV =
            `${this.#NFe.infNFe.ide.cUF}`.padStart(2, '0') + // Código da UF (2 dígitos)
            this.#NFe.infNFe.ide.dhEmi.substring(2, 4) + this.#NFe.infNFe.ide.dhEmi.substring(5, 7) + // Ano e Mês da emissão (AAMM, 4 dígitos)
            `${this.#NFe.infNFe.emit.CNPJ}`.padStart(14, '0') + // CNPJ do emitente (14 dígitos)
            `${this.#NFe.infNFe.ide.mod}`.padStart(2, '0') + // Modelo da NF (2 dígitos)
            `${this.#NFe.infNFe.ide.serie}`.padStart(3, '0') + // Série da NF (3 dígitos)
            `${this.#NFe.infNFe.ide.nNF}`.padStart(9, '0') + // Número da NF (9 dígitos)
            `${this.#NFe.infNFe.ide.tpEmis}`.padStart(1, '0') + // Tipo de Emissão (1 dígito)
            `${this.#NFe.infNFe.ide.cNF}`.padStart(8, '0'); // Código Numérico da NF (8 dígitos)
        this.#NFe.infNFe.ide.cDV = this.#calcularDigitoVerificador(chaveSemDV)
        return `${chaveSemDV}${this.#NFe.infNFe.ide.cDV}`;

    }

    #calcularDigitoVerificador(key: any) {
        if (key.length !== 43) {
            return '';
        }

        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];
        let iCount = 42;
        let weightedSum = 0;

        while (iCount >= 0) {
            for (let mCount = 0; mCount < 8 && iCount >= 0; mCount++) {
                const sub = parseInt(key[iCount], 10);
                weightedSum += sub * multipliers[mCount];
                iCount--;
            }
        }

        let vdigit = 11 - (weightedSum % 11);
        if (vdigit > 9) {
            vdigit = 0;
        }

        return vdigit.toString();
    }

    #conditionalNumberFormatting(number: Number, decimals = 2) {
        if (number === null || number === undefined) {
            return null;
        }
        return Number(number).toFixed(decimals);
    }

    #equalizeICMSParameters(obj: any) {
        const possible = [
            'orig', 'CST', 'modBC', 'vBC', 'pICMS', 'vICMS', 'pFCP', 'vFCP', 'vBCFCP',
            'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vBCFCPST',
            'pFCPST', 'vFCPST', 'vICMSDeson', 'motDesICMS', 'pRedBC', 'vICMSOp', 'pDif',
            'vICMSDif', 'vBCSTRet', 'pST', 'vICMSSTRet', 'vBCFCPSTRet', 'pFCPSTRet',
            'vFCPSTRet', 'pRedBCEfet', 'vBCEfet', 'pICMSEfet', 'vICMSEfet', 'vICMSSubstituto',
            'vICMSSTDeson', 'motDesICMSST', 'pFCPDif', 'vFCPDif', 'vFCPEfet',
            'pRedAdRem', 'motRedAdRem', 'qBCMono', 'adRemICMS', 'vICMSMono', 'vICMSMonoOp',
            'adRemICMSReten', 'vICMSMonoReten', 'vICMSMonoDif', 'vICMSMonoRet', 'adRemICMSRet',
            'cBenefRBC', 'indDeduzDeson'
        ];

        for (const key of possible) {
            if (obj[key] === undefined) {
                obj[key] = null;
            }
        }
        return obj;
    }

    #addChildJS(obj: Record<string, any>, key: string, value: any, required: boolean) {
        if (required || (value !== null && value !== undefined && value !== '')) {
            obj[key] = value;
        }
    }

    generateICMS00(obj: any): Record<string, any> {
        const icms00: Record<string, any> = {};
        this.#addChildJS(icms00, 'orig', obj.orig, true);
        this.#addChildJS(icms00, 'CST', obj.CST, true);
        this.#addChildJS(icms00, 'modBC', obj.modBC, true);
        this.#addChildJS(icms00, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(icms00, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), true);
        this.#addChildJS(icms00, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), true);
        this.#addChildJS(icms00, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms00, 'vFCP', this.#conditionalNumberFormatting(obj.vFCP), false);
        return icms00;
    }

    generateICMS02(obj: any): Record<string, any> {
        const icms02: Record<string, any> = {};
        this.#addChildJS(icms02, 'orig', obj.orig, true);
        this.#addChildJS(icms02, 'CST', obj.CST, true);
        this.#addChildJS(icms02, 'qBCMono', this.#conditionalNumberFormatting(obj.qBCMono, 4), false);
        this.#addChildJS(icms02, 'adRemICMS', this.#conditionalNumberFormatting(obj.adRemICMS, 4), true);
        this.#addChildJS(icms02, 'vICMSMono', this.#conditionalNumberFormatting(obj.vICMSMono), true);
        return icms02;
    }

    generateICMS10(obj: any): Record<string, any> {
        const icms10: Record<string, any> = {};
        this.#addChildJS(icms10, 'orig', obj.orig, true);
        this.#addChildJS(icms10, 'CST', obj.CST, true);
        this.#addChildJS(icms10, 'modBC', obj.modBC, true);
        this.#addChildJS(icms10, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(icms10, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), true);
        this.#addChildJS(icms10, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), true);
        this.#addChildJS(icms10, 'modBCST', obj.modBCST, true);
        this.#addChildJS(icms10, 'pMVAST', this.#conditionalNumberFormatting(obj.pMVAST, 4), false);
        this.#addChildJS(icms10, 'pRedBCST', this.#conditionalNumberFormatting(obj.pRedBCST, 4), false);
        this.#addChildJS(icms10, 'vBCST', this.#conditionalNumberFormatting(obj.vBCST), true);
        this.#addChildJS(icms10, 'pICMSST', this.#conditionalNumberFormatting(obj.pICMSST, 4), true);
        this.#addChildJS(icms10, 'vICMSST', this.#conditionalNumberFormatting(obj.vICMSST), true);
        this.#addChildJS(icms10, 'vBCFCP', this.#conditionalNumberFormatting(obj.vBCFCP), false);
        this.#addChildJS(icms10, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms10, 'vFCP', this.#conditionalNumberFormatting(obj.vFCP), false);
        this.#addChildJS(icms10, 'vBCFCPST', this.#conditionalNumberFormatting(obj.vBCFCPST), false);
        this.#addChildJS(icms10, 'pFCPST', this.#conditionalNumberFormatting(obj.pFCPST, 4), false);
        this.#addChildJS(icms10, 'vFCPST', this.#conditionalNumberFormatting(obj.vFCPST), false);
        this.#addChildJS(icms10, 'vICMSSTDeson', this.#conditionalNumberFormatting(obj.vICMSSTDeson), false);
        this.#addChildJS(icms10, 'motDesICMSST', obj.motDesICMSST, false);
        return icms10;
    }

    generateICMS15(obj: any): Record<string, any> {
        const icms15: Record<string, any> = {};
        this.#addChildJS(icms15, 'orig', obj.orig, true);
        this.#addChildJS(icms15, 'CST', obj.CST, true);
        this.#addChildJS(icms15, 'qBCMono', this.#conditionalNumberFormatting(obj.qBCMono, 4), false);
        this.#addChildJS(icms15, 'adRemICMS', this.#conditionalNumberFormatting(obj.adRemICMS, 4), true);
        this.#addChildJS(icms15, 'vICMSMono', this.#conditionalNumberFormatting(obj.vICMSMono), true);
        this.#addChildJS(icms15, 'qBCMonoReten', this.#conditionalNumberFormatting(obj.qBCMonoReten, 4), false);
        this.#addChildJS(icms15, 'adRemICMSReten', this.#conditionalNumberFormatting(obj.adRemICMSReten, 4), true);
        this.#addChildJS(icms15, 'vICMSMonoReten', this.#conditionalNumberFormatting(obj.vICMSMonoReten), true);
        if (!obj.pRedAdRem) {
            this.#addChildJS(icms15, 'pRedAdRem', this.#conditionalNumberFormatting(obj.pRedAdRem), true);
            this.#addChildJS(icms15, 'motRedAdRem', obj.motRedAdRem, true);
        }
        return icms15;
    }

    generateICMS20(obj: any): Record<string, any> {
        const icms20: Record<string, any> = {};
        this.#addChildJS(icms20, 'orig', obj.orig, true);
        this.#addChildJS(icms20, 'CST', obj.CST, true);
        this.#addChildJS(icms20, 'modBC', obj.modBC, true);
        this.#addChildJS(icms20, 'pRedBC', this.#conditionalNumberFormatting(obj.pRedBC, 4), true);
        this.#addChildJS(icms20, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(icms20, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), true);
        this.#addChildJS(icms20, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), true);
        this.#addChildJS(icms20, 'vBCFCP', this.#conditionalNumberFormatting(obj.vBCFCP), false);
        this.#addChildJS(icms20, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms20, 'vFCP', this.#conditionalNumberFormatting(obj.vFCP), false);
        this.#addChildJS(icms20, 'vICMSDeson', this.#conditionalNumberFormatting(obj.vICMSDeson), false);
        this.#addChildJS(icms20, 'motDesICMS', obj.motDesICMS, false);
        this.#addChildJS(icms20, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms20;
    }

    generateICMS30(obj: any): Record<string, any> {
        const icms30: Record<string, any> = {};
        this.#addChildJS(icms30, 'orig', obj.orig, true);
        this.#addChildJS(icms30, 'CST', obj.CST, true);
        this.#addChildJS(icms30, 'modBCST', obj.modBCST, true);
        this.#addChildJS(icms30, 'pMVAST', this.#conditionalNumberFormatting(obj.pMVAST, 4), false);
        this.#addChildJS(icms30, 'pRedBCST', this.#conditionalNumberFormatting(obj.pRedBCST, 4), false);
        this.#addChildJS(icms30, 'vBCST', this.#conditionalNumberFormatting(obj.vBCST), true);
        this.#addChildJS(icms30, 'pICMSST', this.#conditionalNumberFormatting(obj.pICMSST, 4), true);
        this.#addChildJS(icms30, 'vICMSST', this.#conditionalNumberFormatting(obj.vICMSST), true);
        this.#addChildJS(icms30, 'vBCFCPST', this.#conditionalNumberFormatting(obj.vBCFCPST), false);
        this.#addChildJS(icms30, 'pFCPST', this.#conditionalNumberFormatting(obj.pFCPST, 4), false);
        this.#addChildJS(icms30, 'vFCPST', this.#conditionalNumberFormatting(obj.vFCPST), false);
        this.#addChildJS(icms30, 'vICMSDeson', this.#conditionalNumberFormatting(obj.vICMSDeson), false);
        this.#addChildJS(icms30, 'motDesICMS', obj.motDesICMS, false);
        this.#addChildJS(icms30, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms30;
    }

    generateICMS40(obj: any): Record<string, any> {
        const icms40: Record<string, any> = {};
        this.#addChildJS(icms40, 'orig', obj.orig, true);
        this.#addChildJS(icms40, 'CST', obj.CST, true);
        this.#addChildJS(icms40, 'vICMSDeson', this.#conditionalNumberFormatting(obj.vICMSDeson), false);
        this.#addChildJS(icms40, 'motDesICMS', obj.motDesICMS, false);
        this.#addChildJS(icms40, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms40;
    }

    generateICMS51(obj: any): Record<string, any> {
        const icms51: Record<string, any> = {};
        this.#addChildJS(icms51, 'orig', obj.orig, true);
        this.#addChildJS(icms51, 'CST', obj.CST, true);
        this.#addChildJS(icms51, 'modBC', obj.modBC, false);
        this.#addChildJS(icms51, 'pRedBC', this.#conditionalNumberFormatting(obj.pRedBC, 4), false);
        this.#addChildJS(icms51, 'cBenefRBC', obj.cBenefRBC, false);
        this.#addChildJS(icms51, 'vBC', this.#conditionalNumberFormatting(obj.vBC), false);
        this.#addChildJS(icms51, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), false);
        this.#addChildJS(icms51, 'vICMSOp', this.#conditionalNumberFormatting(obj.vICMSOp), false);
        this.#addChildJS(icms51, 'pDif', this.#conditionalNumberFormatting(obj.pDif, 4), false);
        this.#addChildJS(icms51, 'vICMSDif', this.#conditionalNumberFormatting(obj.vICMSDif), false);
        this.#addChildJS(icms51, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), false);
        this.#addChildJS(icms51, 'vBCFCP', this.#conditionalNumberFormatting(obj.vBCFCP), false);
        this.#addChildJS(icms51, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms51, 'vFCP', this.#conditionalNumberFormatting(obj.vFCP), false);
        this.#addChildJS(icms51, 'pFCPDif', this.#conditionalNumberFormatting(obj.pFCPDif), false);
        this.#addChildJS(icms51, 'vFCPDif', this.#conditionalNumberFormatting(obj.vFCPDif), false);
        this.#addChildJS(icms51, 'vFCPEfet', this.#conditionalNumberFormatting(obj.vFCPEfet), false);
        return icms51;
    }

    generateICMS53(obj: any): Record<string, any> {
        const icms53: Record<string, any> = {};
        this.#addChildJS(icms53, 'orig', obj.orig, true);
        this.#addChildJS(icms53, 'CST', obj.CST, true);
        this.#addChildJS(icms53, 'qBCMono', this.#conditionalNumberFormatting(obj.qBCMono, 4), false);
        this.#addChildJS(icms53, 'adRemICMS', this.#conditionalNumberFormatting(obj.adRemICMS, 4), false);
        this.#addChildJS(icms53, 'vICMSMonoOp', this.#conditionalNumberFormatting(obj.vICMSMonoOp), false);
        this.#addChildJS(icms53, 'pDif', this.#conditionalNumberFormatting(obj.pDif, 4), false);
        this.#addChildJS(icms53, 'vICMSMonoDif', this.#conditionalNumberFormatting(obj.vICMSMonoDif), false);
        this.#addChildJS(icms53, 'vICMSMono', this.#conditionalNumberFormatting(obj.vICMSMono), false);
        return icms53;
    }

    generateICMS60(obj: any): Record<string, any> {
        const icms60: Record<string, any> = {};
        this.#addChildJS(icms60, 'orig', obj.orig, true);
        this.#addChildJS(icms60, 'CST', obj.CST, true);
        this.#addChildJS(icms60, 'vBCSTRet', this.#conditionalNumberFormatting(obj.vBCSTRet), false);
        this.#addChildJS(icms60, 'pST', this.#conditionalNumberFormatting(obj.pST, 4), false);
        this.#addChildJS(icms60, 'vICMSSubstituto', this.#conditionalNumberFormatting(obj.vICMSSubstituto), false);
        this.#addChildJS(icms60, 'vICMSSTRet', this.#conditionalNumberFormatting(obj.vICMSSTRet), false);
        this.#addChildJS(icms60, 'vBCFCPSTRet', this.#conditionalNumberFormatting(obj.vBCFCPSTRet), false);
        this.#addChildJS(icms60, 'pFCPSTRet', this.#conditionalNumberFormatting(obj.pFCPSTRet, 4), false);
        this.#addChildJS(icms60, 'vFCPSTRet', this.#conditionalNumberFormatting(obj.vFCPSTRet), false);
        this.#addChildJS(icms60, 'pRedBCEfet', this.#conditionalNumberFormatting(obj.pRedBCEfet, 4), false);
        this.#addChildJS(icms60, 'vBCEfet', this.#conditionalNumberFormatting(obj.vBCEfet), false);
        this.#addChildJS(icms60, 'pICMSEfet', this.#conditionalNumberFormatting(obj.pICMSEfet, 4), false);
        this.#addChildJS(icms60, 'vICMSEfet', this.#conditionalNumberFormatting(obj.vICMSEfet), false);
        return icms60;
    }

    generateICMS61(obj: any): Record<string, any> {
        const icms61: Record<string, any> = {};
        this.#addChildJS(icms61, 'orig', obj.orig, true);
        this.#addChildJS(icms61, 'CST', obj.CST, true);
        this.#addChildJS(icms61, 'qBCMonoRet', this.#conditionalNumberFormatting(obj.qBCMonoRet, 4), false);
        this.#addChildJS(icms61, 'adRemICMSRet', this.#conditionalNumberFormatting(obj.adRemICMSRet, 4), true);
        this.#addChildJS(icms61, 'vICMSMonoRet', this.#conditionalNumberFormatting(obj.vICMSMonoRet), true);
        return icms61;
    }

    generateICMS70(obj: any): Record<string, any> {
        const icms70: Record<string, any> = {};
        this.#addChildJS(icms70, 'orig', obj.orig, true);
        this.#addChildJS(icms70, 'CST', obj.CST, true);
        this.#addChildJS(icms70, 'modBC', obj.modBC, true);
        this.#addChildJS(icms70, 'pRedBC', this.#conditionalNumberFormatting(obj.pRedBC, 4), true);
        this.#addChildJS(icms70, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(icms70, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), true);
        this.#addChildJS(icms70, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), true);
        this.#addChildJS(icms70, 'vBCFCP', this.#conditionalNumberFormatting(obj.vBCFCP), false);
        this.#addChildJS(icms70, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms70, 'vFCP', obj.vFCP, false);
        this.#addChildJS(icms70, 'modBCST', obj.modBCST, true);
        this.#addChildJS(icms70, 'pMVAST', this.#conditionalNumberFormatting(obj.pMVAST, 4), false);
        this.#addChildJS(icms70, 'pRedBCST', this.#conditionalNumberFormatting(obj.pRedBCST, 4), false);
        this.#addChildJS(icms70, 'vBCST', this.#conditionalNumberFormatting(obj.vBCST), true);
        this.#addChildJS(icms70, 'pICMSST', this.#conditionalNumberFormatting(obj.pICMSST, 4), true);
        this.#addChildJS(icms70, 'vICMSST', this.#conditionalNumberFormatting(obj.vICMSST), true);
        this.#addChildJS(icms70, 'vBCFCPST', this.#conditionalNumberFormatting(obj.vBCFCPST), false);
        this.#addChildJS(icms70, 'pFCPST', this.#conditionalNumberFormatting(obj.pFCPST, 4), false);
        this.#addChildJS(icms70, 'vFCPST', this.#conditionalNumberFormatting(obj.vFCPST), false);
        this.#addChildJS(icms70, 'vICMSDeson', this.#conditionalNumberFormatting(obj.vICMSDeson), false);
        this.#addChildJS(icms70, 'motDesICMS', obj.motDesICMS, false);
        this.#addChildJS(icms70, 'indDeduzDeson', obj.indDeduzDeson, false);
        this.#addChildJS(icms70, 'vICMSSTDeson', this.#conditionalNumberFormatting(obj.vICMSSTDeson), false);
        this.#addChildJS(icms70, 'motDesICMSST', obj.motDesICMSST, false);
        return icms70;
    }

    generateICMS90(obj: any): Record<string, any> {
        const icms90: Record<string, any> = {};
        this.#addChildJS(icms90, 'orig', obj.orig, true);
        this.#addChildJS(icms90, 'CST', obj.CST, true);
        this.#addChildJS(icms90, 'modBC', obj.modBC, false);
        this.#addChildJS(icms90, 'vBC', this.#conditionalNumberFormatting(obj.vBC), false);
        this.#addChildJS(icms90, 'pRedBC', this.#conditionalNumberFormatting(obj.pRedBC, 4), false);
        this.#addChildJS(icms90, 'pICMS', this.#conditionalNumberFormatting(obj.pICMS, 4), false);
        this.#addChildJS(icms90, 'vICMS', this.#conditionalNumberFormatting(obj.vICMS), false);
        this.#addChildJS(icms90, 'vBCFCP', this.#conditionalNumberFormatting(obj.vBCFCP), false);
        this.#addChildJS(icms90, 'pFCP', this.#conditionalNumberFormatting(obj.pFCP, 4), false);
        this.#addChildJS(icms90, 'vFCP', this.#conditionalNumberFormatting(obj.vFCP), false);
        this.#addChildJS(icms90, 'modBCST', obj.modBCST, false);
        this.#addChildJS(icms90, 'pMVAST', this.#conditionalNumberFormatting(obj.pMVAST, 4), false);
        this.#addChildJS(icms90, 'pRedBCST', this.#conditionalNumberFormatting(obj.pRedBCST, 4), false);
        this.#addChildJS(icms90, 'vBCST', this.#conditionalNumberFormatting(obj.vBCST), false);
        this.#addChildJS(icms90, 'pICMSST', this.#conditionalNumberFormatting(obj.pICMSST, 4), false);
        this.#addChildJS(icms90, 'vICMSST', this.#conditionalNumberFormatting(obj.vICMSST), false);
        this.#addChildJS(icms90, 'vBCFCPST', this.#conditionalNumberFormatting(obj.vBCFCPST), false);
        this.#addChildJS(icms90, 'pFCPST', this.#conditionalNumberFormatting(obj.pFCPST, 4), false);
        this.#addChildJS(icms90, 'vFCPST', this.#conditionalNumberFormatting(obj.vFCPST), false);
        this.#addChildJS(icms90, 'vICMSDeson', this.#conditionalNumberFormatting(obj.vICMSDeson), false);
        this.#addChildJS(icms90, 'motDesICMS', obj.motDesICMS, false);
        this.#addChildJS(icms90, 'indDeduzDeson', obj.indDeduzDeson, false);
        this.#addChildJS(icms90, 'vICMSSTDeson', this.#conditionalNumberFormatting(obj.vICMSSTDeson), false);
        this.#addChildJS(icms90, 'motDesICMSST', obj.motDesICMSST, false);
        return icms90;
    }

    equalizeIPIParameters(obj: any) {
        const possible = [
            'item',
            'clEnq',
            'CNPJProd',
            'cSelo',
            'qSelo',
            'cEnq',
            'CST',
            'vIPI',
            'vBC',
            'pIPI',
            'qUnid',
            'vUnid'
        ];

        for (const key of possible) {
            if (obj[key] === undefined) {
                obj[key] = null;
            }
        }
        return obj;
    }

    generateIPITrib(obj: any): Record<string, any> {
        const ipiTrib: Record<string, any> = {};
        this.#addChildJS(ipiTrib, 'CST', obj.CST, true);
        this.#addChildJS(ipiTrib, 'vBC', this.#conditionalNumberFormatting(obj.vBC), false);
        this.#addChildJS(ipiTrib, 'pIPI', this.#conditionalNumberFormatting(obj.pIPI, 4), false);
        this.#addChildJS(ipiTrib, 'qUnid', this.#conditionalNumberFormatting(obj.qUnid, 4), false);
        this.#addChildJS(ipiTrib, 'vUnid', this.#conditionalNumberFormatting(obj.vUnid, 4), false);
        this.#addChildJS(ipiTrib, 'vIPI', this.#conditionalNumberFormatting(obj.vIPI), true);
        return ipiTrib;
    }

    generateIPINT(obj: any): Record<string, any> {
        const ipiNT: Record<string, any> = {};
        this.#addChildJS(ipiNT, 'CST', obj.CST, true);
        return ipiNT;
    }

    #equalizePISParameters(obj: any) {
        const possible = [
            'item',
            'CST',
            'vBC',
            'pPIS',
            'vPIS',
            'qBCProd',
            'vAliqProd'
        ];

        for (const key of possible) {
            if (obj[key] === undefined) {
                obj[key] = null;
            }
        }
        return obj;
    }
    generatePISAliq(obj: any): Record<string, any> {
        const pisAliq: Record<string, any> = {};
        this.#addChildJS(pisAliq, 'CST', obj.CST, true);
        this.#addChildJS(pisAliq, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(pisAliq, 'pPIS', this.#conditionalNumberFormatting(obj.pPIS, 4), true);
        this.#addChildJS(pisAliq, 'vPIS', this.#conditionalNumberFormatting(obj.vPIS), true);
        return pisAliq;
    }

    generatePISQtde(obj: any): Record<string, any> {
        const pisQtde: Record<string, any> = {};
        this.#addChildJS(pisQtde, 'CST', obj.CST, true);
        this.#addChildJS(pisQtde, 'qBCProd', this.#conditionalNumberFormatting(obj.qBCProd, 4), true);
        this.#addChildJS(pisQtde, 'vAliqProd', this.#conditionalNumberFormatting(obj.vAliqProd, 4), true);
        this.#addChildJS(pisQtde, 'vPIS', this.#conditionalNumberFormatting(obj.vPIS), true);
        return pisQtde;
    }

    generatePISNT(obj: any): Record<string, any> {
        const pisNT: Record<string, any> = {};
        this.#addChildJS(pisNT, 'CST', obj.CST, true);
        return pisNT;
    }

    generatePISOutr(obj: any): Record<string, any> {
        const pisOutr: Record<string, any> = {};
        this.#addChildJS(pisOutr, 'CST', obj.CST, true);

        if (obj.qBCProd === null || obj.qBCProd === undefined) {
            this.#addChildJS(pisOutr, 'vBC', this.#conditionalNumberFormatting(obj.vBC), obj.vBC !== null && obj.vBC !== undefined);
            this.#addChildJS(pisOutr, 'pPIS', this.#conditionalNumberFormatting(obj.pPIS, 4), obj.pPIS !== null && obj.pPIS !== undefined);
        } else {
            this.#addChildJS(pisOutr, 'qBCProd', this.#conditionalNumberFormatting(obj.qBCProd, 4), obj.qBCProd !== null && obj.qBCProd !== undefined);
            this.#addChildJS(pisOutr, 'vAliqProd', this.#conditionalNumberFormatting(obj.vAliqProd, 4), obj.vAliqProd !== null && obj.vAliqProd !== undefined);
        }

        this.#addChildJS(pisOutr, 'vPIS', this.#conditionalNumberFormatting(obj.vPIS), obj.vPIS !== null && obj.vPIS !== undefined);
        return pisOutr;
    }

    equalizeCOFINSParameters(obj: any) {
        const possible = [
            'item',
            'CST',
            'vBC',
            'pCOFINS',
            'vCOFINS',
            'qBCProd',
            'vAliqProd'
        ];

        for (const key of possible) {
            if (obj[key] === undefined) {
                obj[key] = null;
            }
        }
        return obj;
    }

    generateCOFINSAliq(obj: any): Record<string, any> {
        const confinsAliq: Record<string, any> = {};
        this.#addChildJS(confinsAliq, 'CST', obj.CST, true);
        this.#addChildJS(confinsAliq, 'vBC', this.#conditionalNumberFormatting(obj.vBC), true);
        this.#addChildJS(confinsAliq, 'pCOFINS', this.#conditionalNumberFormatting(obj.pCOFINS, 4), true);
        this.#addChildJS(confinsAliq, 'vCOFINS', this.#conditionalNumberFormatting(obj.vCOFINS), true);
        return confinsAliq;
    }

    generateCOFINSQtde(obj: any): Record<string, any> {
        const confinsQtde: Record<string, any> = {};
        this.#addChildJS(confinsQtde, 'CST', obj.CST, true);
        this.#addChildJS(confinsQtde, 'qBCProd', this.#conditionalNumberFormatting(obj.qBCProd, 4), true);
        this.#addChildJS(confinsQtde, 'vAliqProd', this.#conditionalNumberFormatting(obj.vAliqProd, 4), true);
        this.#addChildJS(confinsQtde, 'vCOFINS', this.#conditionalNumberFormatting(obj.vCOFINS), true);
        return confinsQtde;
    }

    generateCOFINSNT(obj: any): Record<string, any> {
        const confinsNT: Record<string, any> = {};
        this.#addChildJS(confinsNT, 'CST', obj.CST, true);
        return confinsNT;
    }

    generateCOFINSOutr(obj: any): Record<string, any> {
        const confinsOutr: Record<string, any> = {};
        this.#addChildJS(confinsOutr, 'CST', obj.CST, true);

        if (obj.qBCProd === null || obj.qBCProd === undefined) {
            this.#addChildJS(confinsOutr, 'vBC', this.#conditionalNumberFormatting(obj.vBC), obj.vBC !== null && obj.vBC !== undefined);
            this.#addChildJS(confinsOutr, 'pCOFINS', this.#conditionalNumberFormatting(obj.pCOFINS, 4), obj.pCOFINS !== null && obj.pCOFINS !== undefined);
        } else {
            this.#addChildJS(confinsOutr, 'qBCProd', this.#conditionalNumberFormatting(obj.qBCProd, 4), obj.qBCProd !== null && obj.qBCProd !== undefined);
            this.#addChildJS(confinsOutr, 'vAliqProd', this.#conditionalNumberFormatting(obj.vAliqProd, 4), obj.vAliqProd !== null && obj.vAliqProd !== undefined);
        }

        this.#addChildJS(confinsOutr, 'vCOFINS', this.#conditionalNumberFormatting(obj.vCOFINS), obj.vCOFINS !== null && obj.vCOFINS !== undefined);
        return confinsOutr;
    }

    xml() {
        if (this.#NFe.infNFe[`@Id`] == null) this.#NFe.infNFe[`@Id`] = `NFe${this.#gerarChaveNFe()}`;

        //Adicionar QrCode
        if (this.#NFe.infNFe.ide.mod * 1 == 65) {
            //Como ja temos cUF, vamos usar o extras.cUF2UF
            let tempUF = urlEventos(cUF2UF[this.#NFe.infNFe.ide.cUF], this.#NFe.infNFe['@versao']);
            this.#NFe.infNFeSupl = {
                qrCode: tempUF.mod65[this.#NFe.infNFe.ide.tpAmb == 1 ? 'producao' : 'homologacao'].NFeConsultaQR, //Este não e o valor final, vamos utilizar apenas para carregar os dados que vão ser utlizados no make
                urlChave: tempUF.mod65[this.#NFe.infNFe.ide.tpAmb == 1 ? 'producao' : 'homologacao'].urlChave
            }
        }

        let tempBuild = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: "@"
        });
        return tempBuild.build({ NFe: this.#NFe });
    }

    //Obtem os dados de importo e soma no total, utlizado sempre que for setado algum imposto.
    #calICMSTot(obj: any) {
        Object.keys(obj).map(key => {
            if (this.#ICMSTot[key] !== undefined) {
                this.#ICMSTot[key] += (obj[key]) * 1;
            }
        });

    }
}


export { Make }
export default { Make }