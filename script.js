/* 参考:
 *  http://scrap.php.xdomain.jp/javascript_table_control/
 *  https://so-zou.jp/web-app/tech/programming/javascript/dom/node/element/html/table/#no5
 */

/*
 *  クラス宣言
 */
class TSMCell {
  constructor(text, w=1, h=1) {
    this.text     = text;   // 中身
    this.width    = w;      // 幅   (colspan)
    this.height   = h;      // 高さ (rowspan)
    this.display  = true;   // 表示・非表示
    this.isHeader = false;  // ヘッダーか
  }
}

/*
 *  onclick
 */
//
// cell の追加
//    row: 追加先の行
//    idx: 追加 index. -1 で最後尾に追加
//
function addCellToRow(row, idx) {
  var cell = row.insertCell(idx);
  // 性質を不可
  cell.contentEditable = true;
  cell.oncontextmenu = function() {
    cellContextMenu();
    return false;
  };
}

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
    addCellToRow(row, -1);
  }
}

//
// 列の追加
//
function appendColumn(id) {
  var table = document.getElementById(id);
  var n_row = table.rows.length;
  for (var i = 0;  i < n_row; i++) {
    addCellToRow(table.rows[i], -1)
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
    case "Trac Wiki2":
      text = generateTracWikiTable2(table);
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
  // 改行をスペースに変換
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
      var cell = cells[j];

      // 横方向の結合を反映
      text += repeat_str('||', cell.colSpan - 1);
      j += cell.colSpan - 1;

      // check header
      var bg = cell.style.backgroundColor;
      if ( bg != "" )
        text += "="

      text += " " + getTextFromCell(cell) + " ";

      if ( bg != "" )
        text += "="
      text += "||"
    }
    text += "\n";
  }

  return text;
}

//
// Trac Wiki のテーブル構文を生成(processor)
//    - 縦結合が可能
//
function generateTracWikiTable2(table) {
  var text = "";
  var array2d = tableToArray(table);

  for (var i = 0; i < array2d.length; i++) {
    var row = array2d[i];
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      if ( !cell.display )
        continue;

      if ( cell.isHeader )
        text += "{{{#!th";
      else
        text += "{{{#!td";

      // 幅、高さ設定
      if ( cell.width > 1 )
        text += " colspan=" + cell.width;
      if ( cell.height > 1 )
        text += " rowspan=" + cell.height;
      text += "\n" + cell.text + "\n}}}\n";
    }

    // NOTE: 最終行はいらない
    if ( i < array2d.length - 1 )
      text += "|------------\n";
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
      var cell = cells[j];
      if ( cell.style.display == "none" )
        continue;

      var bg = cell.style.backgroundColor;
      if ( bg != "" )
        text += "_.";

      // 横結合
      if ( cell.colSpan > 1 )
        text += "\\" + cell.colSpan + ".";
      // 縦結合
      if ( cell.rowSpan > 1 )
        text += "/" + cell.colSpan + ".";

      text += " " + getTextFromCell(cell) + " |";
    }
    text += "\n";
  }

  return text;
}

//
// html 形式
//
function generateHtmlTable(table) {
  return "html";
}

//
// rst 形式
//
function generateRstTable(table) {
  return "rst";
}

//
// 文字列成型テーブル
//    +-------+-----+---+
//    | hogeo | mic | A |
//    +-------+-----+---+
//    | DeDeDeDaiou | B |
//    +-------+-----+---+
//    |             | C |
//    |     mok     +---+
//    |             | D |
//    +-------+-----+---+
//
function generateTextTable(table) {
  var text = "";
  var array2d = tableToArray(table);

  // 各列に必要な幅を調べる
  var widths = getRequireWidthArray(array2d);

  // 本体部分
  // NOTE: セルの幅は最大文字数 + スペース 2 つぶん
  // 上の罫線
  text += "+";
  for (var j = 0; j < array2d[0].length; j++)
    text += '-' + repeat_str("-", widths[j]) + "-+";
  text += "\n";

  // セル
  for (var i = 0; i < array2d.length; i++) {
    // 中身部分
    text += "|";
    for (var j = 0; j < array2d[i].length; j++) {
      var cell = array2d[i][j];

      // このセルの幅を先に計算
      var cwidth = widths[j];
      for (var k = 1; k < cell.width; k++) {
        cwidth += 3 + widths[j + k];
      }
      // とばすセル分先に進む
      j += cell.width - 1;

      // <sp> + text + <margin> + <sp>
      var n_space = cwidth - cell.text.length;
      text += " " + cell.text + repeat_str(" ", n_space) + " |";
    }
    text += "\n";
     
    // 罫線
    text += "+";
    for (var j = 0; j < array2d[i].length; j++)
    {
      var elem = '-';
      var sep  = '+';

      // 上の方にあるセルが 2 以上の rowSpan をもっているなら消えるかも
      for (var k = 0; k <= i; k++) {
        var cell = array2d[i - k][j];
        if ( cell.height >= 2 + k ) {
          elem = " ";
          break;
        }
      }

      // そして横線が消えたなら、左側セルの colSpan によっては右の + も消えるかも
      if ( elem == " " ) {
        for (var k = 0; k <= j; k++) {
          var cell = array2d[i][j - k];
          if ( cell.width >= 2 + k ) {
            sep = " ";
            break;
          }
        }
      }

      text += elem + repeat_str(elem, widths[j]) + elem;
      text += sep;
    }
    text += "\n";
  }
  return text;
}

//
// 各列に必要な幅の配列を取得
//
function getRequireWidthArray(array2d) {
  // 各列の幅を調べる
  var widths = Array.apply(null, Array(array2d[0].length)).map(function () {return 0});
  for (var i = 0; i < array2d.length; i++) {
    for (var j = 0; j < array2d[i].length; j++) {
      var cell = array2d[i][j];
      var len = cell.text.length;
      if ( !len )
        len = 0;

      // 幅がある場合は長さを 幅だけ当分する
      div_len = Math.ceil((len - cell.width + 1) / cell.width);

      for (var k = 0; k < cell.width; k++) {
        // 今までの最大幅を超えるならセット
        if ( widths[j+k] < div_len )
          widths[j+k] = div_len;
      }
    }
  }

  return widths;
}

//
// 出力エリアのクリア
//
function clearOutputArea(outAreaId) {
  var outArea = document.getElementById(outAreaId);
  outArea.value = "";
}


//
// 右クリックメニュー
//
function cellContextMenu() {
  // get caller object
  var cell = event.target;
  var menu = document.getElementById('conmenu');

  cell.addEventListener('contextmenu',function(e){
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    menu.classList.add('on'); // on をクラスに追加することで可視化?

    // conmenu にセルの情報を渡す
    var menuList = menu.children[0].children; 
    menuList[0].onclick = function() { combineToCell(cell, 'right') };
    menuList[1].onclick = function() { combineToCell(cell, 'under') };
    menuList[2].onclick = function() { uncombineCells(cell) };
  });

  //左クリック時に独自コンテキストメニューを非表示にする
  document.body.addEventListener('click',function(){
    if(menu.classList.contains('on')){
      menu.classList.remove('on');
    }
  });
}

//
// セルの結合
//
function combineToCell(cell, direction) {
  var row = cell.parentNode;
  var table = row.parentNode;

  var n_row = table.rows.length;
  var n_col = row.cells.length;

  var rowIdx = row.rowIndex;
  var colIdx = cell.cellIndex;

  // rowspan, colspan を増やしつつ地上げ
  // 消すセルの rowspan, colspan を加算する
  switch ( direction ) {
    case "right":
      // 端っこはむり
      if ( colIdx + cell.colSpan > n_col - 1 )
        break;
      var rightCell = row.cells[colIdx + cell.colSpan];
      // マージ先と高さが揃ってないとだめ
      if ( cell.rowSpan != rightCell.rowSpan )
        break;

      cell.colSpan += rightCell.colSpan;
      // 非表示セルにも幅を設定
      for (var i = 1; i < cell.rowSpan; i++) {
        subrow = table.rows[rowIdx+i];
        subrow.cells[colIdx].colSpan = cell.colSpan;
      }

      // 結合に使われたセルを非表示
      rightCell.style.display = "none"; 
      rightCell.innerHTML = "";
      break;
    case "under":
      // 下端はむり
      if ( rowIdx + cell.rowSpan > n_row - 1 )
        break;
      var underCell = table.rows[rowIdx + cell.rowSpan].cells[colIdx];
      // マージ先と幅が揃ってないとだめ
      if ( cell.colSpan != underCell.colSpan )
        break;

      cell.rowSpan += underCell.rowSpan;

      // 非表示セルにも高さを設定
      for (var i = 1; i < cell.colSpan; i++) {
        row.cells[colIdx+i].rowSpan = cell.rowSpan;
      }

      // 結合に使われたセルを非表示
      underCell.style.display = "none";
      underCell.innerHTML = "";
      break;
  }
}

//
// セルの結合解除
//
function uncombineCells(cell) {
  var rowSpan = cell.rowSpan;
  var colSpan = cell.colSpan;
  if ( rowSpan == 1 && colSpan == 1 )
    return;

  var row = cell.parentNode;
  var table = row.parentNode;

  var rowIdx = row.rowIndex;
  var colIdx = cell.cellIndex;

  // 足りない部分を追加
  // 自分の row は必ず check
  for (var j = colIdx + 1; j < colIdx + colSpan; j++) {
    row.cells[j].style.display = "";
    row.cells[j].rowSpan = 1;
    row.cells[j].colSpan = 1;
  }

  for(var i = rowIdx + 1; i < rowIdx + rowSpan; i++) {
    for (var j = colIdx; j < colIdx + colSpan; j++) {
      table.rows[i].cells[j].style.display = "";
      table.rows[i].cells[j].rowSpan = 1;
      table.rows[i].cells[j].colSpan = 1;
    }
  }

  // セルの大きさを 1x1 に
  cell.rowSpan = 1;
  cell.colSpan = 1;
}

/*
 *  Utility
 */
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
// 表の行数、列数の最大値を求める
//
function getMaxRowCount(table) {
  return table.rows.length;
}
function getMaxColumnCount(table) {
  var rows = table.rows;
  var max = 0;
  for (var i = 0; i < rows.length; i++) {
    var n_col = rows[i].cells.length;
    if ( max < n_col )
      max = n_col;
  }
  return max;
}

//
// table を二次元配列に変換
//    TODO: ヘッダ判定
//
function tableToArray(table) {
  var array2d = new Array();
  var rows = table.rows;

  // table を回って配列に値をいれていく
  for (var i = 0; i < rows.length; i++) {
    var array = new Array();

    var row = rows[i];
    for (var j = 0; j < row.cells.length; j++) {
      var cell = row.cells[j];
      var tsmcell = new TSMCell(cell.innerHTML, cell.colSpan, cell.rowSpan);
      if ( cell.style.display == "none" )
        tsmcell.display = false;
      array.push(tsmcell);
    }

    array2d.push(array);
  }

  return array2d;
}
