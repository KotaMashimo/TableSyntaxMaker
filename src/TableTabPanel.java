import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;

import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.table.DefaultTableModel;

public class TableTabPanel extends JPanel {
	private static final long serialVersionUID = 1L;

	// output type
    protected String[] types = {"Trac Wiki", "Markdown", "Textile", "text"};

	// components
	GridBagLayout gbl = new GridBagLayout();
	DefaultTableModel model;
	JTable table;
	JScrollPane scroll;
	JButton add_row_btn, remove_row_btn;
	JButton add_col_btn, remove_col_btn;
	JButton convert_btn;
	JComboBox<Object> type_select_box;
	JCheckBox need_header;
	JTextArea output_area;
	
	// Parameters
	int n_col = 8;
	int n_row = 5;
	int cell_width 	= 80;
	int cell_height = 25;
	int tbl_width 	= cell_width * n_col;
	int tbl_height 	= cell_height * n_row; 
	
	// ref: http://www.tohoho-web.com/java/layout.htm
	private void addComponent(Component comp, int x, int y, int w, int h) {
		GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.BOTH;
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.gridwidth = w;
        gbc.gridheight = h;
        gbl.setConstraints(comp, gbc);
        this.add(comp);
	}
	
	public TableTabPanel() {
	    this.setLayout(gbl);
	    
	    // 入力テーブル
	    // TODO: コピペ、セルの結合
	    model = new DefaultTableModel();
	    table = new JTable(model);
	    scroll = new JScrollPane(table);
	    // FIXME: でかすぎる
	    //scroll.setMinimumSize(scroll.getPreferredSize());
	    scroll.setMinimumSize(new Dimension(tbl_width, tbl_height));
	    addComponent(scroll, 0, 0, 8, 5);
	    
	    // table のデザイン
	    table.setGridColor(Color.DARK_GRAY);
	    // 選択セルをわかりやすく
	    table.setRowSelectionAllowed(true);
	    table.setColumnSelectionAllowed(true);
	    
	    // 初期行列追加
	    for (int j = 0; j < n_col; j++)
	    	model.addColumn("");
	    for (int i = 0; i < n_row; i++)
	    	model.addRow(new Object[model.getColumnCount()]);

	    // 行の増減ボタン
	    add_row_btn = new JButton("+");
	    remove_row_btn = new JButton("-");
	    add_row_btn.addActionListener(new AddRowButtonListener(table));
	    remove_row_btn.addActionListener(new RemoveRowButtonListener(table));
	    addComponent(remove_row_btn, 0, 7, 1, 1);
	    addComponent(add_row_btn, 0, 8, 1, 1);
	    	    
	    // 列の増減ボタン
	    // FIXME: 位置がいまいち
	    add_col_btn = new JButton("+");
	    remove_col_btn = new JButton("-");
	    add_col_btn.addActionListener(new AddColumnButtonListener(table));
	    remove_col_btn.addActionListener(new RemoveColumnButton(table));
	    addComponent(remove_col_btn, 10, 0, 1, 1);
	    addComponent(add_col_btn, 11, 0, 1, 1);

	    // 出力エリア
	    output_area = new JTextArea();
	    output_area.setEditable(false);
	    output_area.setMinimumSize(new Dimension(tbl_width, tbl_height));
	    addComponent(output_area, 0, 9, 8, 5);
	    
	    // 出力形式選択ボタン
	    type_select_box = new JComboBox<Object>(types);
	    addComponent(new JLabel(" type:"), 10, 9, 1, 1);
	    addComponent(type_select_box, 11, 9, 1, 1);
	    
	    // ヘッダの設定
	    // TODO: チェックが入ったら、テーブルの該当箇所の色を変える？
	    need_header = new JCheckBox();
	    addComponent(new JLabel(" header:"), 10, 10, 1, 1);
	    addComponent(need_header, 11, 10, 1, 1);
	    
	    // 生成ボタン
	    convert_btn = new JButton("Generate");
	    convert_btn.addActionListener(
	    		new GenerateButtonListener(table, type_select_box,
	    								   need_header, output_area));
	    addComponent(convert_btn, 10, 7, 2, 2);
	    
	}
}
