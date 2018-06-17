import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

public class RemoveColumnButton implements ActionListener {
	protected JTable table;
	
	public RemoveColumnButton(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		// 最後尾を消す
		DefaultTableModel model = (DefaultTableModel) table.getModel();
		int col_idx = model.getColumnCount() - 1;
		
		if ( col_idx < 0 )
			return;
		
		model.setColumnCount(col_idx);
	}
}
