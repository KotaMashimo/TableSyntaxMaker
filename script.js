/* 参考:
 *  http://scrap.php.xdomain.jp/javascript_table_control/
 *  https://so-zou.jp/web-app/tech/programming/javascript/dom/node/element/html/table/#no5
 */

//
// 行の追加
//
function appendRow(id) {
  var table = document.getElementById(id);

  // 行末に行を追加
  var row = table.insertRow(-1);

  // cell を追加
  var n_col = table.rows[0].cells.length;

  // td
  for (var i = 0; i < n_col; i++) {
    var cell = row.insertCell(-1);
    cell.contentEditable = true;
  }
}

//
// 行の削除
//
function deleteRow(id) {
  var table = document.getElementById(id);
  // 行ヘッダは消さない
  if ( table.rows.length <= 1 )
    return;
  table.deleteRow(-1);
}

//
// 列の追加
//
function appendColumn(id) {
  var table = document.getElementById(id);
  var n_row = table.rows.length;
  for (var i = 0;  i < n_row; i++) {
    var cell = table.rows[i].insertCell(-1);
    cell.contentEditable = true;
  }
}

//
// 列削除
//
function deleteColumn(id) {
  var table = document.getElementById(id);
  var n_row = table.rows.length;

  // 行ヘッダは消さない
  var n_col = table.rows[0].cells.length;
  if ( n_col <= 1 )
    return;

  for (var i = 0; i < n_row; i++) {
    table.rows[i].deleteCell(-1);
  }
}

//
// ヘッダ部分の背景色を変化
//
function setColumnHeaderColor(tableId, checkBoxId) {
  var checkBox = document.getElementById(checkBoxId);
  var color = (checkBox.checked) ? "lightgray" : "";

  var table = document.getElementById(tableId);
  var cells = table.rows[0].cells;

  for (var i = 0; i< cells.length; i++) {
    var style = cells[i].style; 
    var bg = style.backgroundColor;
    if ( bg == "lightgray" && color == "lightgray" )
      style.backgroundColor = "darkgray";
    else if ( bg == "darkgray" && color == "" )
      style.backgroundColor = "lightgray";
    else
      style.backgroundColor = color;
  }
}

function setRowHeaderColor(tableId, checkBoxId) {
  var checkBox = document.getElementById(checkBoxId);
  var color = (checkBox.checked) ? "lightgray" : "";

  var table = document.getElementById(tableId);
  var rows = table.rows;

  for (var i = 0; i < rows.length; i++) {
    var style = rows[i].cells[0].style;
    var bg = style.backgroundColor;
    if ( bg == "lightgray" && color == "lightgray" )
      style.backgroundColor = "darkgray";
    else if ( bg == "darkgray" && color == "" )
      style.backgroundColor = "lightgray";
    else
      style.backgroundColor = color;
  }
}

//
// 構文生成
//
function generateSyntax(tableId, outAreaId, outTypeSelectId) {
  var table = document.getElementById(tableId);
  var outArea = document.getElementById(outAreaId);
  var outTypeSelect = document.getElementById(outTypeSelectId);

  var type = outTypeSelect.value;
  var text = "";
  // テーブルの中身を抽出

  switch( type ) {
    case "Trac Wiki":
      text = generateTracWikiTable(table);
      break;
    case "Markdown":
      text = generateMarkdownTable(table);
      break;
    case "textile":
      text = generateTextileTable(table);
      break;
    case "plain text":
      text = generateTextTable(table);
      break;
    default:
      text = "Error: unknown output type";
      break;
  }

  // テキストエリアにセットする
  outArea.value = text;
}

//
// cell から文字列を取り出す
//
function getTextFromCell(cell) {
  return cell.innerHTML.replace("<br>", " ");
}

//
// Trac Wiki のテーブル構文を生成
//
function generateTracWikiTable(table) {
  var text = "";
  var rows = table.rows;

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;

    text += "||";
    for (var j = 0; j < cells.length; j++) {
      var bg = cells[j].style.backgroundColor;
      if ( bg != "" )
        text += "="

      text += " " + getTextFromCell(cells[j]) + " ";

      if ( bg != "" )
        text += "="
      text += "||"
    }
    text += "\n";
  }

  return text;
}

//
// Markdown 形式のテーブル構文を生成
//
function generateMarkdownTable(table) {
  var text = "";
  var rows = table.rows;

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;

    text += "|";
    for (var j = 0; j < cells.length; j++)
      text += " " + getTextFromCell(cells[j]) + " |";
    text += "\n";

    // NOTE: header は必須. とりあえず左寄せ
    if ( i == 0 ) {
      text += "|";
      for (var j = 0; j < cells.length; j++)
        text += "---|";
      text += "\n";
    }
  }

  return text;
}

//
// textile 形式のテーブル構文を生成 (for Redmine)
//
function generateTextileTable(table) {
  var text = "";
  var rows = table.rows;

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;

    text += "|";
    for (var j = 0; j < cells.length; j++) {
      var bg = cells[j].style.backgroundColor;
      if ( bg != "" )
        text += "_.";
      text += " " + getTextFromCell(cells[j]) + " |";
    }
    text += "\n";
  }

  return text;
}

//
// 文字列成型テーブル
//
function generateTextTable(table) {
  var text = "";
  var rows = table.rows;

  // 各列の幅を調べる
  var widths = Array.apply(null, Array(rows[0].cells.length)).map(function () {return 0});
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
      var len = getTextFromCell(cells[j]).length;
      if ( !len )
        len = 0;

      if ( widths[j] < len )
        widths[j] = len;
    }
  }

  // 文字列生成
  text += "+"
  for (var j = 0; j < widths.length; j++)
    text += "-" + repeat_str('-', widths[j]) + "-+";
  text += "\n";

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;

    // 中身
    text += "|";
    for (var j = 0; j < cells.length; j++) {
      var elem = getTextFromCell(cells[j]);
      // NOTE: 空白で足りない部分は埋める
      text += " " + elem + repeat_str(' ', widths[j] - elem.length) + " |";
    }
    text += "\n";

    // 仕切り線
    text += "+"
    for (var j = 0; j < widths.length; j++)
      text += "-" + repeat_str('-', widths[j]) + "-+";
    text += "\n";
  }
  return text;
  
}

//
// 文字列を指定回数繰り返して連結
//
function repeat_str(str, num) {
  var text = "";
  for (var i = 0; i < num; i++)
    text += str;
  return text;
}

//
// 出力エリアのクリア
//
function clearOutputArea(outAreaId) {
  var outArea = document.getElementById(outAreaId);
  outArea.value = "";
}
