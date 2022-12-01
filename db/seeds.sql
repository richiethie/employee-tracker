INSERT INTO department(name)
VALUES ("Sales"), ("Finance"), ("Engineering"), ("Legal");

INSERT INTO roles(title, salary, department_id)
VALUES ("Salesperson", 80000, 1), 
("Sales Manager", 100000, 1), 
("Accountant", 110000, 2), 
("Account Manager", 130000, 2), 
("Software Engineer", 135000, 3), 
("Lead Engineer", 165000, 3), 
("Lawyer", 178000, 4), 
("Legal Team Lead", 250000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Pratt", 2, NULL),
("Bob", "Marley", 1, 1),
("Post", "Malone", 4, NULL),
("Roddy", "Rich", 3, 3),
("Swae", "Lee", 6, NULL),
("DJ", "Khaled", 5, 5),
("Tom", "Brady", 8, NULL),
("Aaron", "Rodgers", 7, 7);