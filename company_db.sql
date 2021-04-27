create database company_db;

use company_db;

create table department (
	id int not null auto_increment,
    name varchar(30) not null,
    primary key(id)
);

create table emp_role (
	id int not null auto_increment,
    title varchar(30) not null,
    salary decimal(9,2) not null,
    department_id int,
    foreign key(department_id) references department(id),
    primary key(id)
);

create table employee (
	id int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int, 
    foreign key(role_id) references emp_role(id),
    foreign key(manager_id) references employee(id), 
    primary key(id)
);

insert into department (name)
values
	('Marketing'), 
	('Human Resources'), 
    ('Legal'), 
    ('Research & Development'), 
    ('Security'),
    ('Management');

insert into emp_role (title, salary, department_id)
values
	('Cold-Caller', 50000, 1),
    ('Whip-Hand', 80000, 2),
    ('Litigator', 125000, 3),
    ('Mad Scientist', 125000, 4),
    ('Night-Watch', 35000, 5),
    ('Email-Blaster', 50000, 1),
    ('Manager', 200000, 6),
    ('Supreme-Leader', 300000, 6);

insert into employee (first_name, last_name, role_id)
values
	('Ron', 'Asheton', 3),
    ('John', 'LeCarre', 4),
    ('Graham', 'Greene', 1),
    ('Haruki', 'Murakami', 2),
    ('Jungi', 'Ito', 1),
    ('Charles', 'Schulz', 7),
    ('Raymond', 'Chandler', 6),
    ('Lester', 'Young', 8);
    
update employee 
set manager_id = 4
where id < 10;

update employee 
set manager_id = 8
where id = 4;

update employee 
set manager_id = null
where id = 8;

SELECT emp_role.id, title, employee.id, last_name FROM emp_role INNER JOIN employee ON emp_role.id = employee.id