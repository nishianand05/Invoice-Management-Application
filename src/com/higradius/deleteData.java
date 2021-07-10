package com.higradius;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class deleteData
 */

@WebServlet("/deleteData")
public class deleteData extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public deleteData() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//		response.getWriter().append("Served at: ").append(request.getContextPath());
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		response.setContentType("text/html");
		PrintWriter pw = response.getWriter();
		
		String DB_URL = "jdbc:mysql://localhost/highradius";
		String USER = "root";
		String PASSWORD = "root";
		
		Connection conn;
		
		try {
			
			int invoice_id = Integer.parseInt(request.getParameter("invoice_id"));
			int rs;
//			System.out.println(request.getParameter("invoice_id"));
//			System.out.println(invoice_id);
//			System.out.println(invoice_id);
			
			
			Class.forName("com.mysql.cj.jdbc.Driver");
			conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
			conn.setAutoCommit(false);
			
			String sql = "DELETE FROM invoiceData WHERE invoice_id = ?";
			
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, invoice_id);
			
//			System.out.println(pstmt);
			
			rs = pstmt.executeUpdate();
		
//			System.out.println(rs);
			
			
			if(rs != 0) {
				pw.println("Record deleted");
			} else {
				pw.println("Failed");
			}
		
			conn.commit();
			
			pstmt.close();
			conn.close();
		
		
		} catch (Exception e) {
			pw.println(e);
		}
		
	}
}
