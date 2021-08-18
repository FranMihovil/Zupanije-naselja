const fs = require("fs")
const XLSX = require('xlsx')

const workbook = XLSX.readFile('nl-112.xlsx')
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const allSheetData = XLSX.utils.sheet_to_json(sheet)
const dataToSave = allSheetData
    .slice(1)
    .slice(0, -1)
    .map(({ __EMPTY_1, __EMPTY_2, __EMPTY_3 }) => ({
        nazivZupanije: __EMPTY_1,
        nazivLokalneJedinice: __EMPTY_2,
        brojStanovnika: __EMPTY_3
    }))

module.exports=dataToSave