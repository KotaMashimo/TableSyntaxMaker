import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Objects;

import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.table.TableModel;

/*
 *  generate ボタンのリスナー
 * 	table の内容を変換してテキストエリアに出す
 * 	TODO: テーブルの編集が終わるたびにこれを起動すればいいのでは。。。？
 */
public class GenerateButtonListener implements ActionListener {
	protected JTable input_table;
	protected JTextArea output_area;
	protected JComboBox<?> type_box;
	protected JCheckBox	need_header;
	
	public GenerateButtonListener(
			JTable input_table,
			JComboBox<?> type_box,
			JCheckBox need_header,
			JTextArea output_area) {
		this.input_table = input_table;
		this.output_area = output_area;
		this.type_box 	= type_box;
		this.need_header = need_header;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {		
		TableModel model = input_table.getModel();
		boolean set_header = need_header.isSelected();

		if ( type_box.getSelectedItem() == "Trac Wiki" ) {
			output_area.setText(table2TracWiki(model, set_header));
		}
		else if ( type_box.getSelectedItem() == "Markdown" ) {
			output_area.setText(table2Markdown(model));
		}
		else if ( type_box.getSelectedItem() == "Textile" ) {
			output_area.setText(table2Textile(model, set_header));
		}
		else {
			output_area.setText("Not implemented yet");
		}
	}

	/*
	 * Table -> Trac Wiki
	 */
	private String table2TracWiki(TableModel model, boolean set_header) {
		int n_row = model.getRowCount();
		int n_col = model.getColumnCount();
	
		String tmpl = "";
		for (int i = 0; i < n_row; i++) {
			String row = "||";
			if ( set_header && i == 0 )
				row += "=";
			
			for (int j = 0; j < n_col; j++) {
				Object value = model.getValueAt(i, j);
				row += " " + Objects.toString(value, "") + " ";
				if ( set_header && i == 0 )
					row += "=";
				row += "||";
			}
			tmpl += row + "\n";
		}
		return tmpl;
	}
	
	/*
	 * Table -> Markdown
	 */
	private String table2Markdown(TableModel model) {
		int n_row = model.getRowCount();
		int n_col = model.getColumnCount();
	
		String tmpl = "";
		for (int i = 0; i < n_row; i++) {
			String row = "|";
			for (int j = 0; j < n_col; j++) {
				Object value = model.getValueAt(i, j);
				row += " " + Objects.toString(value, "") + " |";
			}
			tmpl += row + "\n";
			
			// TODO: アラインメントを自由に設定したい
			if ( i == 0 ) {
				row = "|";
				for (int j = 0; j < n_col; j++) {
					row += ":-:|";
				}
				tmpl += row + "\n";
			}
		}
		return tmpl;
	}
	
	/*
	 * Table -> Textile
	 */
	private String table2Textile(TableModel model, boolean set_header) {
		int n_row = model.getRowCount();
		int n_col = model.getColumnCount();
	
		String tmpl = "";
		for (int i = 0; i < n_row; i++) {
			String row = "|";
			for (int j = 0; j < n_col; j++) {
				Object value = model.getValueAt(i, j);
				if ( set_header && i == 0 )
					row += "_.";
				row += " " + Objects.toString(value, "") + " |";
			}
			tmpl += row + "\n";
		}
		return tmpl;
	}
}