var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Make_instances, _Make_NFe, _Make_ICMSTot, _Make_gerarChaveNFe, _Make_calcularDigitoVerificador, _Make_conditionalNumberFormatting, _Make_equalizeICMSParameters, _Make_addChildJS, _Make_equalizePISParameters, _Make_calICMSTot;
import { XMLBuilder } from "fast-xml-parser";
import { urlEventos } from "./eventos.js";
import { cUF2UF } from "./extras.js";
//Classe da nota fiscal
class Make {
    constructor() {
        _Make_instances.add(this);
        _Make_NFe.set(this, {
            "@xmlns": "http://www.portalfiscal.inf.br/nfe",
            infNFe: {
            //"@xmlns": "http://www.portalfiscal.inf.br/nfe",
            }
        });
        _Make_ICMSTot.set(this, {
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
        });
    }
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
    tagInfNFe(obj) {
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe[`@${key}`] = obj[key];
        });
    }
    tagIde(obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide = new Object();
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide[key] = obj[key];
        });
    }
    //Referencimanto de NFe
    tagRefNFe(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = new Array();
        }
        if (Array.isArray(obj)) { //Array de referenciamento de refNFe
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = obj.map(ref => ({ refNFe: `${ref}` }));
        }
        else { //String unica de refNFe
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref.push({ refNFe: obj });
        }
    }
    tagRefNF(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = new Array();
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref.push({ refNF: obj });
    }
    tagRefNFP(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = new Array();
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref.push({ refNFP: obj });
    }
    tagRefCTe(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = new Array();
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref.push({ refCTe: obj });
    }
    tagRefECF(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref = new Array();
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.NFref.push({ refECF: obj });
    }
    tagEmit(obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.emit = new Object();
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.emit[key] = obj[key];
            if (key == "xFant") {
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.emit.enderEmit = {};
            }
        });
    }
    tagEnderEmit(obj) {
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.emit.enderEmit[key] = obj[key];
        });
    }
    tagDest(obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.dest = {};
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.tpAmb == 2 && obj['xNome'] !== undefined)
            obj['xNome'] = "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL";
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.dest[key] = obj[key];
            if (key == "xNome" && __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.mod == 55) {
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.dest.enderDest = {};
            }
        });
    }
    tagEnderDest(obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.mod == 65)
            return 1;
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.dest.enderDest = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.dest.enderDest[key] = obj[key];
        });
    }
    tagRetirada(obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.retirada = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.retirada[key] = obj[key];
        });
    }
    tagAutXML(obj) {
        if (typeof __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.autXML == "undefined") {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.autXML = new Array();
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.autXML.push(obj);
    }
    //tagprod
    async tagProd(obj) {
        //Abrir tag de imposto
        for (let cont = 0; cont < obj.length; cont++) {
            if (obj[cont]['@nItem'] === undefined) {
                obj[cont] = { '@nItem': cont + 1, prod: obj[cont], imposto: {} };
            }
            else {
                obj[cont] = { '@nItem': obj[cont]['@nItem'], prod: obj[cont], imposto: {} };
                delete obj[cont].prod['@nItem'];
            }
            //Primeiro item + NFCe + Homologação
            if (cont == 0 && __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.mod == 65 && __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.tpAmb == 2)
                obj[cont].prod.xProd = "NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL";
            obj[cont].prod.qCom = (obj[cont].prod.qCom * 1).toFixed(4);
            obj[cont].prod.vUnCom = (obj[cont].prod.vUnCom * 1).toFixed(10);
            obj[cont].prod.vProd = (obj[cont].prod.vProd * 1).toFixed(2);
            if (obj[cont].prod.vDesc !== undefined)
                obj[cont].prod.vDesc = (obj[cont].prod.vDesc * 1).toFixed(2);
            obj[cont].prod.qTrib = (obj[cont].prod.qTrib * 1).toFixed(4);
            obj[cont].prod.vUnTrib = (obj[cont].prod.vUnTrib * 1).toFixed(10);
            //Calcular ICMSTot
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj[cont].prod);
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det = obj;
    }
    tagCreditoPresumidoProd(obj) {
        throw "não implementado!";
    }
    taginfAdProd(index, obj) {
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index][key] = obj[key];
        });
    }
    tagCEST(obj) {
        throw "não implementado!";
    }
    tagRECOPI(obj) {
        throw "não implementado!";
    }
    tagDI(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI[key] = obj[key];
        });
        //Adicionar ao imposto global
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagAdi(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI = {};
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI.adi === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI.adi = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].DI.adi[key] = obj[key];
        });
        //Adicionar ao imposto global
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagDetExport(obj) {
        throw "não implementado!";
    }
    tagDetExportInd(obj) {
        throw "não implementado!";
    }
    tagRastro(obj) {
        throw "não implementado!";
    }
    tagVeicProd(obj) {
        throw "não implementado!";
    }
    tagMed(obj) {
        throw "não implementado!";
    }
    tagArma(obj) {
        throw "não implementado!";
    }
    tagComb(obj) {
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
    tagProdICMS(index, data) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f")?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto = {};
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS = {};
        }
        const obj = __classPrivateFieldGet(this, _Make_instances, "m", _Make_equalizeICMSParameters).call(this, data);
        let keyXML = "";
        switch (obj.CST) {
            case '00':
                keyXML = 'ICMS00';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS00(obj);
                break;
            case '02':
                keyXML = 'ICMS02';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS02(obj);
                break;
            case '10':
                keyXML = 'ICMS10';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS10(obj);
                break;
            case '15':
                keyXML = 'ICMS15';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS15(obj);
                break;
            case '20':
                keyXML = 'ICMS20';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS20(obj);
                break;
            case '30':
                keyXML = 'ICMS30';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS30(obj);
                break;
            case '40':
            case '41':
            case '50':
                keyXML = 'ICMS40';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS40(obj);
                break;
            case '51':
                keyXML = 'ICMS51';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS51(obj);
                break;
            case '53':
                keyXML = 'ICMS53';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS53(obj);
                break;
            case '60':
                keyXML = 'ICMS60';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS60(obj);
                break;
            case '61':
                keyXML = 'ICMS61';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS61(obj);
                break;
            case '70':
                keyXML = 'ICMS70';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS70(obj);
                break;
            case '90':
                keyXML = 'ICMS90';
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = this.generateICMS90(obj);
                break;
            default:
                throw new Error(`CST inválido: ${obj.CST}`);
        }
    }
    // Imposto Seletivo (IS)
    tagImpostoIS(detIndex, obj) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto = {};
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto.IS = obj;
    }
    // Imposto IBS
    tagImpostoIBS(detIndex, obj) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto = {};
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto.IBS = obj;
    }
    // Imposto CBS
    tagImpostoCBS(detIndex, obj) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto = {};
        }
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[detIndex].imposto.CBS = obj;
    }
    tagProdICMSPart(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS = {};
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS.ICMSPart = {};
        Object.keys(obj).forEach(key => {
            if (key != 'orig' && key != 'modBC')
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS.ICMSPart[key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    //
    tagProdICMSST(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS = {};
        let CST = obj.CST;
        //delete obj.CST;
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[`ICMS${CST}`] = {};
        Object.keys(obj).forEach(key => {
            if (!["orig", "CSOSN", "modBC", "modBCST"].includes(key))
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[`ICMS${CST}`][key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    //
    tagProdICMSSN(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS = {};
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
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML] = {};
        Object.keys(obj).forEach(key => {
            if (key != 'orig')
                obj[key] = obj[key] == 0 ? "0.00" : obj[key];
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMS[keyXML][key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdICMSUFDest(index, obj) {
        console.log(__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total);
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMSUFDest === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMSUFDest = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ICMSUFDest[key] = obj[key] == 0 ? "0.00" : obj[key];
        });
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot)?.call(this, obj); // opcional
    }
    tagProdIPI(index, data) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f")?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto = {};
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI = {};
        }
        const obj = this.equalizeIPIParameters(data);
        // Campo obrigatório na raiz do IPI
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI.cEnq = obj.cEnq;
        let keyXML = "";
        let ipiTag = {}; // Use um objeto local para construir a tag
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
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI[keyXML] = ipiTag;
        // Adicionar campos opcionais na raiz do IPI
        if (obj.clEnq) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI.clEnq = obj.clEnq;
        }
        if (obj.CNPJProd) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI.CNPJProd = obj.CNPJProd;
        }
        if (obj.cSelo) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI.cSelo = obj.cSelo;
        }
        if (obj.qSelo) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.IPI.qSelo = obj.qSelo;
        }
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj); // opcional se considerar IPI no total
    }
    tagProdII(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.II === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.II = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.II[key] = obj[key];
        });
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdPIS(index, data) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f")?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto = {};
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PIS) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PIS = {};
        }
        const obj = __classPrivateFieldGet(this, _Make_instances, "m", _Make_equalizePISParameters).call(this, data);
        let keyXML = "";
        let pisItem = {};
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
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PIS[keyXML] = pisItem;
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdPISST(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PISST === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PISST = {};
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PISST = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PISST[key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdCOFINS(index, data) {
        if (!__classPrivateFieldGet(this, _Make_NFe, "f")?.infNFe?.det?.[index]) {
            throw new Error(`Produto na posição ${index} não existe em infNFe.det`);
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto = {};
        }
        if (!__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS) {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS = {};
        }
        const obj = this.equalizeCOFINSParameters(data);
        let keyXML = "";
        let confinsItem = {};
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
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS[keyXML] = confinsItem;
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdCOFINSST(index, obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS = {};
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.COFINS.COFINSST = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.PIS.COFINSST[key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdISSQN(index, obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ISSQN = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.det[index].imposto.ISSQN[key] = obj[key];
        });
        //Calcular ICMSTot
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_calICMSTot).call(this, obj);
    }
    tagProdImpostoDevol(index, obj) {
        throw "Não implementado!";
    }
    tagICMSTot(obj = null) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total = {
            ICMSTot: {}
        };
        Object.keys(__classPrivateFieldGet(this, _Make_ICMSTot, "f")).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total.ICMSTot[key] = (__classPrivateFieldGet(this, _Make_ICMSTot, "f")[key] * 1).toFixed(2);
        });
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total.ICMSTot.vNF = (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total.ICMSTot.vProd - __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total.ICMSTot.vDesc).toFixed(2);
        if (obj != null) { // Substituir campos que deseja
            Object.keys(obj).forEach(key => {
                __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.total.ICMSTot[key] = obj[key];
            });
        }
    }
    tagISSQNTot(obj) {
        throw "Não implementado!";
    }
    tagRetTrib(obj) {
        throw "Não implementado!";
    }
    tagTransp(obj) {
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.transp = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.transp[key] = obj[key];
        });
    }
    tagTransporta(obj) {
        throw "Não implementado!";
    }
    tagRetTransp(obj) {
        throw "Não implementado!";
    }
    tagVeicTransp(obj) {
        throw "Não implementado!";
    }
    tagReboque(obj) {
        throw "Não implementado!";
    }
    tagVagao(obj) {
        throw "Não implementado!";
    }
    tagBalsa(obj) {
        throw "Não implementado!";
    }
    tagVol(obj) {
        throw "Não implementado!";
    }
    tagLacres(obj) {
        throw "Não implementado!";
    }
    tagFat(obj) {
        var _a;
        if (!obj)
            throw new Error("Parâmetro obrigatório para tagFat está vazio");
        const cobr = (_a = __classPrivateFieldGet(this, _Make_NFe, "f").infNFe).cobr ?? (_a.cobr = {}); // Garante que 'cobr' existe
        const fat = cobr.fat = {};
        for (const key of ['nFat', 'vOrig', 'vDesc', 'vLiq']) {
            if (['vOrig', 'vDesc', 'vLiq'].includes(key)) {
                fat[key] = Number(obj[key]).toFixed(2);
            }
            else {
                fat[key] = obj[key];
            }
        }
        return this;
    }
    tagDup(lista) {
        var _a;
        if (!Array.isArray(lista) || lista.length === 0) {
            throw new Error("Parâmetro obrigatório para tagDup deve ser uma lista não vazia");
        }
        const cobr = (_a = __classPrivateFieldGet(this, _Make_NFe, "f").infNFe).cobr ?? (_a.cobr = {});
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
    tagTroco(obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag = {};
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag.vTroco = obj;
    }
    tagDetPag(obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag = {};
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.pag.detPag = obj;
    }
    tagIntermed(obj) {
        throw "Não implementado!";
    }
    tagInfAdic(obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infAdic === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infAdic = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infAdic[key] = obj[key];
        });
    }
    tagObsCont(obj) {
        throw "Não implementado!";
    }
    tagObsFisco(obj) {
        throw "Não implementado!";
    }
    tagProcRef(obj) {
        throw "Não implementado!";
    }
    tagExporta(obj) {
        throw "Não implementado!";
    }
    tagCompra(obj) {
        throw "Não implementado!";
    }
    tagCana(obj) {
        throw "Não implementado!";
    }
    tagforDia() {
    }
    tagdeduc() {
    }
    taginfNFeSupl() {
    }
    tagInfRespTec(obj) {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infRespTec === undefined)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infRespTec = {};
        Object.keys(obj).forEach(key => {
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.infRespTec[key] = obj[key];
        });
    }
    //Endereço para retirada
    tagRetiEnder(obj) {
        throw "Ainda não configurado!";
    }
    //Endereço para entrega
    tagEntrega(obj) {
        throw "Ainda não configurado!";
    }
    generateICMS00(obj) {
        const icms00 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'modBC', obj.modBC, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms00, 'vFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCP), false);
        return icms00;
    }
    generateICMS02(obj) {
        const icms02 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms02, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms02, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms02, 'qBCMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCMono, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms02, 'adRemICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.adRemICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms02, 'vICMSMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMono), true);
        return icms02;
    }
    generateICMS10(obj) {
        const icms10 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'modBC', obj.modBC, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'modBCST', obj.modBCST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pMVAST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pMVAST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pRedBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBCST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMSST, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vBCFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vBCFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'pFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'vICMSSTDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSSTDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms10, 'motDesICMSST', obj.motDesICMSST, false);
        return icms10;
    }
    generateICMS15(obj) {
        const icms15 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'qBCMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCMono, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'adRemICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.adRemICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'vICMSMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMono), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'qBCMonoReten', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCMonoReten, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'adRemICMSReten', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.adRemICMSReten, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'vICMSMonoReten', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMonoReten), true);
        if (!obj.pRedAdRem) {
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'pRedAdRem', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedAdRem), true);
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms15, 'motRedAdRem', obj.motRedAdRem, true);
        }
        return icms15;
    }
    generateICMS20(obj) {
        const icms20 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'modBC', obj.modBC, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'pRedBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBC, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'vBCFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'vFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'vICMSDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'motDesICMS', obj.motDesICMS, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms20, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms20;
    }
    generateICMS30(obj) {
        const icms30 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'modBCST', obj.modBCST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'pMVAST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pMVAST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'pRedBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBCST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'vBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'pICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMSST, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'vICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'vBCFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'pFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'vFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'vICMSDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'motDesICMS', obj.motDesICMS, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms30, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms30;
    }
    generateICMS40(obj) {
        const icms40 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms40, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms40, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms40, 'vICMSDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms40, 'motDesICMS', obj.motDesICMS, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms40, 'indDeduzDeson', obj.indDeduzDeson, false);
        return icms40;
    }
    generateICMS51(obj) {
        const icms51 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'modBC', obj.modBC, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'pRedBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBC, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'cBenefRBC', obj.cBenefRBC, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vICMSOp', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSOp), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'pDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pDif, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vICMSDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDif), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vBCFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'pFCPDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPDif), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vFCPDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPDif), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms51, 'vFCPEfet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPEfet), false);
        return icms51;
    }
    generateICMS53(obj) {
        const icms53 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'qBCMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCMono, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'adRemICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.adRemICMS, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'vICMSMonoOp', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMonoOp), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'pDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pDif, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'vICMSMonoDif', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMonoDif), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms53, 'vICMSMono', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMono), false);
        return icms53;
    }
    generateICMS60(obj) {
        const icms60 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vBCSTRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCSTRet), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'pST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vICMSSubstituto', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSSubstituto), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vICMSSTRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSSTRet), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vBCFCPSTRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCPSTRet), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'pFCPSTRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPSTRet, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vFCPSTRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPSTRet), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'pRedBCEfet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBCEfet, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vBCEfet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCEfet), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'pICMSEfet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMSEfet, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms60, 'vICMSEfet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSEfet), false);
        return icms60;
    }
    generateICMS61(obj) {
        const icms61 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms61, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms61, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms61, 'qBCMonoRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCMonoRet, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms61, 'adRemICMSRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.adRemICMSRet, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms61, 'vICMSMonoRet', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSMonoRet), true);
        return icms61;
    }
    generateICMS70(obj) {
        const icms70 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'modBC', obj.modBC, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pRedBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBC, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vBCFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vFCP', obj.vFCP, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'modBCST', obj.modBCST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pMVAST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pMVAST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pRedBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBCST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMSST, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSST), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vBCFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'pFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vICMSDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'motDesICMS', obj.motDesICMS, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'indDeduzDeson', obj.indDeduzDeson, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'vICMSSTDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSSTDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms70, 'motDesICMSST', obj.motDesICMSST, false);
        return icms70;
    }
    generateICMS90(obj) {
        const icms90 = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'orig', obj.orig, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'modBC', obj.modBC, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pRedBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBC, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMS, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vICMS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMS), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vBCFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCP, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vFCP', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCP), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'modBCST', obj.modBCST, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pMVAST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pMVAST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pRedBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pRedBCST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vBCST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pICMSST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vICMSST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vBCFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBCFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'pFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pFCPST, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vFCPST', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vFCPST), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vICMSDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'motDesICMS', obj.motDesICMS, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'indDeduzDeson', obj.indDeduzDeson, false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'vICMSSTDeson', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vICMSSTDeson), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, icms90, 'motDesICMSST', obj.motDesICMSST, false);
        return icms90;
    }
    equalizeIPIParameters(obj) {
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
    generateIPITrib(obj) {
        const ipiTrib = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'pIPI', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pIPI, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'qUnid', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qUnid, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'vUnid', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vUnid, 4), false);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiTrib, 'vIPI', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vIPI), true);
        return ipiTrib;
    }
    generateIPINT(obj) {
        const ipiNT = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, ipiNT, 'CST', obj.CST, true);
        return ipiNT;
    }
    generatePISAliq(obj) {
        const pisAliq = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisAliq, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisAliq, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisAliq, 'pPIS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pPIS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisAliq, 'vPIS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vPIS), true);
        return pisAliq;
    }
    generatePISQtde(obj) {
        const pisQtde = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisQtde, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisQtde, 'qBCProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCProd, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisQtde, 'vAliqProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vAliqProd, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisQtde, 'vPIS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vPIS), true);
        return pisQtde;
    }
    generatePISNT(obj) {
        const pisNT = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisNT, 'CST', obj.CST, true);
        return pisNT;
    }
    generatePISOutr(obj) {
        const pisOutr = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'CST', obj.CST, true);
        if (obj.qBCProd === null || obj.qBCProd === undefined) {
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), obj.vBC !== null && obj.vBC !== undefined);
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'pPIS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pPIS, 4), obj.pPIS !== null && obj.pPIS !== undefined);
        }
        else {
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'qBCProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCProd, 4), obj.qBCProd !== null && obj.qBCProd !== undefined);
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'vAliqProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vAliqProd, 4), obj.vAliqProd !== null && obj.vAliqProd !== undefined);
        }
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, pisOutr, 'vPIS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vPIS), obj.vPIS !== null && obj.vPIS !== undefined);
        return pisOutr;
    }
    equalizeCOFINSParameters(obj) {
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
    generateCOFINSAliq(obj) {
        const confinsAliq = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsAliq, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsAliq, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsAliq, 'pCOFINS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pCOFINS, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsAliq, 'vCOFINS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vCOFINS), true);
        return confinsAliq;
    }
    generateCOFINSQtde(obj) {
        const confinsQtde = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsQtde, 'CST', obj.CST, true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsQtde, 'qBCProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCProd, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsQtde, 'vAliqProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vAliqProd, 4), true);
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsQtde, 'vCOFINS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vCOFINS), true);
        return confinsQtde;
    }
    generateCOFINSNT(obj) {
        const confinsNT = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsNT, 'CST', obj.CST, true);
        return confinsNT;
    }
    generateCOFINSOutr(obj) {
        const confinsOutr = {};
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'CST', obj.CST, true);
        if (obj.qBCProd === null || obj.qBCProd === undefined) {
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'vBC', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vBC), obj.vBC !== null && obj.vBC !== undefined);
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'pCOFINS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.pCOFINS, 4), obj.pCOFINS !== null && obj.pCOFINS !== undefined);
        }
        else {
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'qBCProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.qBCProd, 4), obj.qBCProd !== null && obj.qBCProd !== undefined);
            __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'vAliqProd', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vAliqProd, 4), obj.vAliqProd !== null && obj.vAliqProd !== undefined);
        }
        __classPrivateFieldGet(this, _Make_instances, "m", _Make_addChildJS).call(this, confinsOutr, 'vCOFINS', __classPrivateFieldGet(this, _Make_instances, "m", _Make_conditionalNumberFormatting).call(this, obj.vCOFINS), obj.vCOFINS !== null && obj.vCOFINS !== undefined);
        return confinsOutr;
    }
    xml() {
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe[`@Id`] == null)
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFe[`@Id`] = `NFe${__classPrivateFieldGet(this, _Make_instances, "m", _Make_gerarChaveNFe).call(this)}`;
        //Adicionar QrCode
        if (__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.mod * 1 == 65) {
            //Como ja temos cUF, vamos usar o extras.cUF2UF
            let tempUF = urlEventos(cUF2UF[__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.cUF], __classPrivateFieldGet(this, _Make_NFe, "f").infNFe['@versao']);
            __classPrivateFieldGet(this, _Make_NFe, "f").infNFeSupl = {
                qrCode: tempUF.mod65[__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.tpAmb == 1 ? 'producao' : 'homologacao'].NFeConsultaQR, //Este não e o valor final, vamos utilizar apenas para carregar os dados que vão ser utlizados no make
                urlChave: tempUF.mod65[__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.tpAmb == 1 ? 'producao' : 'homologacao'].urlChave
            };
        }
        let tempBuild = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: "@"
        });
        return tempBuild.build({ NFe: __classPrivateFieldGet(this, _Make_NFe, "f") });
    }
}
_Make_NFe = new WeakMap(), _Make_ICMSTot = new WeakMap(), _Make_instances = new WeakSet(), _Make_gerarChaveNFe = function _Make_gerarChaveNFe() {
    const chaveSemDV = `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.cUF}`.padStart(2, '0') + // Código da UF (2 dígitos)
        __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.dhEmi.substring(2, 4) + __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.dhEmi.substring(5, 7) + // Ano e Mês da emissão (AAMM, 4 dígitos)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.emit.CNPJ}`.padStart(14, '0') + // CNPJ do emitente (14 dígitos)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.mod}`.padStart(2, '0') + // Modelo da NF (2 dígitos)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.serie}`.padStart(3, '0') + // Série da NF (3 dígitos)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.nNF}`.padStart(9, '0') + // Número da NF (9 dígitos)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.tpEmis}`.padStart(1, '0') + // Tipo de Emissão (1 dígito)
        `${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.cNF}`.padStart(8, '0'); // Código Numérico da NF (8 dígitos)
    __classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.cDV = __classPrivateFieldGet(this, _Make_instances, "m", _Make_calcularDigitoVerificador).call(this, chaveSemDV);
    return `${chaveSemDV}${__classPrivateFieldGet(this, _Make_NFe, "f").infNFe.ide.cDV}`;
}, _Make_calcularDigitoVerificador = function _Make_calcularDigitoVerificador(key) {
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
}, _Make_conditionalNumberFormatting = function _Make_conditionalNumberFormatting(number, decimals = 2) {
    if (number === null || number === undefined) {
        return null;
    }
    return Number(number).toFixed(decimals);
}, _Make_equalizeICMSParameters = function _Make_equalizeICMSParameters(obj) {
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
}, _Make_addChildJS = function _Make_addChildJS(obj, key, value, required) {
    if (required || (value !== null && value !== undefined && value !== '')) {
        obj[key] = value;
    }
}, _Make_equalizePISParameters = function _Make_equalizePISParameters(obj) {
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
}, _Make_calICMSTot = function _Make_calICMSTot(obj) {
    Object.keys(obj).map(key => {
        if (__classPrivateFieldGet(this, _Make_ICMSTot, "f")[key] !== undefined) {
            __classPrivateFieldGet(this, _Make_ICMSTot, "f")[key] += (obj[key]) * 1;
        }
    });
};
export { Make };
export default { Make };
