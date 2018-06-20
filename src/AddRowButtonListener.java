import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class AddRowButtonListener implements ActionListener {
	protected JTable table;
	
	public AddRowButtonListener(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		DefaultTableModel model = (DefaultTableModel) table.getModel();
		Object[] empty = new Object[model.getColumnCount()];
		model.addRow(empty);
	}

}
