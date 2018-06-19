import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Objects;

import javax.swing.JComboBox;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.table.TableModel;

/*
 * convert ボタンのリスナー
 * 	table の内容を変換してテキストエリアに出す
 * 	TODO: テーブルの編集が終わるたびにこれを起動すればいいのでは。。。？
 */
public class ConvertButtonListener implements ActionListener {
	protected JTable inputTable;
	protected JTextArea outputArea;
	protected JComboBox<?> typeBox;
	
	public ConvertButtonListener(JTable inputTable, JComboBox<?> typeBox, JTextArea outputArea) {
		this.inputTable = inputTable;
		this.outputArea = outputArea;
		this.typeBox 	= typeBox;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		outputArea.setText("");
		
		TableModel model = inputTable.getModel();
		int n_row = model.getRowCount();
		int n_col = model.getColumnCount();
		
		if ( typeBox.getSelectedItem() == "Trac Wiki" ) {
			for (int i = 0; i < n_row; i++) {
				String row = "||";
				for (int j = 0; j < n_col; j++) {
					Object value = model.getValueAt(i, j);
					row += " " + Objects.toString(value, "") + " ||";
				}
				outputArea.append(row + "\n");
			}
		}
		else if ( typeBox.getSelectedItem() == "Markdown" ) {
			for (int i = 0; i < n_row; i++) {
				String row = "|";
				for (int j = 0; j < n_col; j++) {
					Object value = model.getValueAt(i, j);
					row += " " + Objects.toString(value, "") + " |";
				}
				outputArea.append(row + "\n");
				
				if ( i == 0 ) {
					row = "|";
					for (int j = 0; j < n_col; j++) {
						row += ":--------:|";
					}
					outputArea.append(row + "\n");
				}
			}			
		}
	}
}

