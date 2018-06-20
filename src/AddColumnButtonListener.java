import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class AddColumnButtonListener implements ActionListener {
	protected JTable table;
	
	public AddColumnButtonListener(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		DefaultTableModel model = (DefaultTableModel) table.getModel();
		model.addColumn("");
		
		// TODO: テーブルのサイズを増やす？
	}

}
