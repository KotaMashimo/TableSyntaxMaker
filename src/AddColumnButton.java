import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.TableColumn;

public class AddColumnButton implements ActionListener {
	protected JTable table;
	
	public AddColumnButton(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		// 空の列を追加
		table.addColumn(new TableColumn());
		
		// TODO: テーブルのサイズを増やす？
	}

}
