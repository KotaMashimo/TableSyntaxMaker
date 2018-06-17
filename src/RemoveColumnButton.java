import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTable;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;

public class RemoveColumnButton implements ActionListener {
	protected JTable table;
	
	public RemoveColumnButton(JTable table) {
		this.table = table;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		// 最後尾を消す
		TableColumnModel col_model = table.getColumnModel();
		int col_idx = col_model.getColumnCount() - 1;
		
		if ( col_idx < 0 )
			return;
		
		TableColumn last_col = col_model.getColumn(col_idx);
		table.removeColumn(last_col);
	}
}
