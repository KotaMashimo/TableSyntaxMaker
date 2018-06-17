import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class AddRowButton implements ActionListener {
	protected JTable table;
	
	public AddRowButton(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		DefaultTableModel model = (DefaultTableModel) table.getModel();
		Object[] empty = new Object[model.getColumnCount()];
		model.addRow(empty);
	}

}
