package com.higradius;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class FetchDataServlet
 */
@WebServlet("/FetchDataServlet")
public class FetchDataServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
	
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost/highradius";
	
	private static final String USER = "root";
	private static final String PASSWORD = "root";
	
    public FetchDataServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		Connection conn = null;
		Statement stmt = null;
		String sql = null;
		ResultSet rs = null;
		
		String name_customer = null;
		String cust_number = null;
		String invoice_id = null;
		String total_open_amount = null;
		String due_in_date = null;
		String predicted_payment_date = null;
		String notes = null;
		
		List<fetchDataPojo> responseList = new ArrayList<>();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
			stmt = conn.createStatement();
			sql = "select name_customer, cust_number, invoice_id, total_open_amount, due_in_date, predicted_payment_date, notes from invoiceData";
			rs = stmt.executeQuery(sql);
			
			while(rs.next()) {
				
				fetchDataPojo pojoResponse = new fetchDataPojo();
				
				name_customer = rs.getString("name_customer");
				cust_number = rs.getString("cust_number");
				invoice_id = rs.getString("invoice_id");
				total_open_amount = rs.getString("total_open_amount");
				due_in_date = rs.getString("due_in_date");
				predicted_payment_date = rs.getString("predicted_payment_date");
				notes = rs.getString("notes");
//				System.out.println(name_customer + " " + cust_number);
				
				pojoResponse.setName_customer(name_customer);
				pojoResponse.setCust_number(cust_number);
				pojoResponse.setInvoice_id(invoice_id);
				pojoResponse.setTotal_open_amount(total_open_amount);
				pojoResponse.setDue_in_date(due_in_date);
				pojoResponse.setPredicted_payment_date(predicted_payment_date);
				pojoResponse.setNotes(notes);
				
				responseList.add(pojoResponse);
				}
			
				Gson gson = new GsonBuilder().setPrettyPrinting().create();
				String json = gson.toJson(responseList);
//				System.out.println(json);
				
				response.setContentType("application/json");
				
				try {
					response.getWriter().write(json);
				} catch (IOException e) {
					e.printStackTrace();
				}
				
		} catch (SQLException se) {
			se.printStackTrace();
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			try {
				rs.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				stmt.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}
