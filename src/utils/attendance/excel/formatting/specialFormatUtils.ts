
import * as XLSX from "xlsx";
import { applyCellBorders } from "./styleFormatUtils";
import { applyCellTextFormatting } from "./textFormatUtils";
import { applyCellFont } from "./styleFormatUtils";
import { applyCellFill } from "./styleFormatUtils";

export const applyFolgaCellFormatting = (
  ws: XLSX.WorkSheet,
  cellAddress: string
): void => {
  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: 'FOLGA' };
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  
  applyCellBorders(ws, cellAddress, 'thin');
  
  applyCellTextFormatting(ws, cellAddress, {
    wrapText: true,
    horizontal: 'center',
    vertical: 'center'
  });
  
  applyCellFont(ws, cellAddress, { 
    bold: true,
    size: 12
  });
  
  applyCellFill(ws, cellAddress, "FEF7CD");
};

export const applyRow2Formatting = (
  ws: XLSX.WorkSheet
): void => {
  for (let c = 0; c <= 5; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c });
    
    if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
    
    if (!ws[cellAddress].s) ws[cellAddress].s = {};
    ws[cellAddress].s.alignment = {
      wrapText: true,
      vertical: 'top',
      horizontal: 'left',
      shrinkToFit: false
    };
    
    ws[cellAddress].z = '@';
    
    if (ws[cellAddress].v && typeof ws[cellAddress].v === 'string') {
      ws[cellAddress].h = ws[cellAddress].v.replace(/\n/g, '<br>');
      
      ws[cellAddress].r = [{
        t: ws[cellAddress].v,
        s: { font: { name: 'Calibri', sz: 11 } }
      }];
    }
  }
};
