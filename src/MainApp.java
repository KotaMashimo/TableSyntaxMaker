import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.table.DefaultTableModel;

public class MainApp extends JFrame {
	private static final long serialVersionUID = 1L;

	GridBagLayout gbl = new GridBagLayout();
	
	DefaultTableModel model;
	JTable table;
	JScrollPane scroll;
	JButton add_row_btn, remove_row_btn;
	JButton add_col_btn, remove_col_btn;
	JButton convert_btn;
	JComboBox<Object> type_select_box;
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
	
	public MainApp() {
		this.setSize(new Dimension(tbl_width + 150, tbl_height * 2 + 100));
	    this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	    
	    this.setLayout(gbl);
	    
	    model = new DefaultTableModel(n_row, n_col);
	    table = new JTable(model);
	    scroll = new JScrollPane(table);
	    // FIXME: でかすぎる
	    //scroll.setMinimumSize(scroll.getPreferredSize());
	    scroll.setMinimumSize(new Dimension(tbl_width, tbl_height));
	    addComponent(scroll, 0, 0, 8, 5);
	    
	    // table のデザイン
	    table.setGridColor(Color.DARK_GRAY);
	    
	    // 行の増減ボタン
	    add_row_btn = new JButton("+");
	    remove_row_btn = new JButton("-");
	    add_row_btn.addActionListener(new AddRowButton(table));
	    remove_row_btn.addActionListener(new RemoveRowButton(table));
	    addComponent(remove_row_btn, 0, 7, 1, 1);
	    addComponent(add_row_btn, 0, 8, 1, 1);
	    	    
	    // 列の増減ボタン
	    add_col_btn = new JButton("+");
	    remove_col_btn = new JButton("-");
	    add_col_btn.addActionListener(new AddColumnButton(table));
	    remove_col_btn.addActionListener(new RemoveColumnButton(table));
	    addComponent(remove_col_btn, 10, 0, 1, 1);
	    addComponent(add_col_btn, 11, 0, 1, 1);

	    // 出力エリア
	    output_area = new JTextArea();
	    output_area.setEditable(false);
	    output_area.setMinimumSize(new Dimension(tbl_width, tbl_height));
	    addComponent(output_area, 0, 9, 8, 5);
	    
	    // 出力形式選択ボタン
	    String[] types = {"Trac Wiki", "Markdown"};
	    type_select_box = new JComboBox<Object>(types);
	    addComponent(new JLabel("type:"), 10, 9, 1, 1);
	    addComponent(type_select_box, 11, 9, 1, 1);
	    
	    // 変換ボタン
	    convert_btn = new JButton("CONVERT");
	    convert_btn.addActionListener(new ConvertButtonListener(table, type_select_box, output_area));
	    addComponent(convert_btn, 10, 7, 2, 2);
	}
	
	public static void main(String[] args) {
		new MainApp().setVisible(true);
	}
}
