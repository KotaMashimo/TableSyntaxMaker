import java.awt.Dimension;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;

public class MainApp extends JFrame {
	private static final long serialVersionUID = 1L;
	JTabbedPane tabbedPane;

	public MainApp() {
		this.setSize(new Dimension(900, 400));
	    this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	    
	    tabbedPane = new JTabbedPane();
	    add(tabbedPane);
	    
	    // Tab1: table
	    JPanel tab1 = new TableTabPanel();
	    tabbedPane.add("sheet", tab1);
	    
	    // Tab2: text
	    JPanel tab2 = new TextTabPanel();
	    tabbedPane.addTab("text", tab2);
	}
	
	public static void main(String[] args) {
		new MainApp().setVisible(true);
	}
}
