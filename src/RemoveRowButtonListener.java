import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class RemoveRowButtonListener implements ActionListener {
	protected JTable table;
	
	public RemoveRowButtonListener(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		DefaultTableModel model = (DefaultTableModel) table.getModel();
		int last_row_idx = model.getRowCount() - 1;
		
		if ( last_row_idx < 0)
			return;
		
		// TODO: もし最終行が選択されていたら、一つ↑の行に選択を移す？
		
		model.removeRow(last_row_idx);	
	}

}
