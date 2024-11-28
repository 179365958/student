-- 检查并创建数据库
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'StudentDB')
BEGIN
    CREATE DATABASE StudentDB
END
GO

-- 使用 StudentDB
USE StudentDB
GO

-- 先删除现有的表（注意删除顺序，先删除有外键依赖的表）
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPermissions')
    DROP TABLE UserPermissions
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Permissions')
    DROP TABLE Permissions
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Scores')
    DROP TABLE Scores
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Students')
    DROP TABLE Students
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Courses')
    DROP TABLE Courses
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Classes')
    DROP TABLE Classes
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
    DROP TABLE Users
GO

-- 创建班级表
CREATE TABLE Classes (
    ClassID INT PRIMARY KEY IDENTITY(1,1),        -- 班级ID，主键自增
    ClassNo VARCHAR(10) NOT NULL UNIQUE,          -- 班级编号，唯一
    ClassName NVARCHAR(50) NOT NULL,              -- 班级名称
    Grade NVARCHAR(20) NOT NULL,                  -- 年级
    TeacherName NVARCHAR(20),                     -- 班主任姓名
    StudentCount INT DEFAULT 0,                   -- 学生人数
    Description NVARCHAR(500),                    -- 描述
    IsDelete BIT NOT NULL DEFAULT 0,              -- 是否删除，0-未删除，1-已删除
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),    -- 创建时间（时间戳）
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())     -- 更新时间（时间戳）
)
GO

-- 插入班级测试数据
INSERT INTO Classes (ClassNo, ClassName, Grade, TeacherName, StudentCount, Description, IsDelete) 
VALUES ('C001', N'一年级1班', N'一年级', N'张老师', 30, N'这是一年级1班，班主任是张老师', 0)
GO

INSERT INTO Classes (ClassNo, ClassName, Grade, TeacherName, StudentCount, Description, IsDelete) 
VALUES ('C002', N'一年级2班', N'一年级', N'李老师', 28, N'这是一年级2班，班主任是李老师', 0)
GO

INSERT INTO Classes (ClassNo, ClassName, Grade, TeacherName, StudentCount, Description, IsDelete) 
VALUES ('C003', N'二年级1班', N'二年级', N'王老师', 32, N'这是二年级1班，班主任是王老师', 0)
GO

INSERT INTO Classes (ClassNo, ClassName, Grade, TeacherName, StudentCount, Description, IsDelete) 
VALUES ('C004', N'二年级2班', N'二年级', N'赵老师', 29, N'这是二年级2班，班主任是赵老师', 0)
GO

INSERT INTO Classes (ClassNo, ClassName, Grade, TeacherName, StudentCount, Description, IsDelete) 
VALUES ('C005', N'三年级1班', N'三年级', N'刘老师', 31, N'这是三年级1班，班主任是刘老师', 0)
GO

-- 创建课程表
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),       -- 课程ID，主键自增
    CourseName NVARCHAR(100) NOT NULL,            -- 课程名称
    Teacher NVARCHAR(50),                         -- 任课教师
    Credits INT DEFAULT 1,                        -- 学分
    Description NVARCHAR(500),                    -- 课程描述
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())
)
GO

-- 插入课程测试数据
INSERT INTO Courses (CourseName, Teacher, Credits, Description) 
VALUES (N'语文', N'张老师', 4, N'基础语文课程')
GO

INSERT INTO Courses (CourseName, Teacher, Credits, Description) 
VALUES (N'数学', N'李老师', 4, N'基础数学课程')
GO

INSERT INTO Courses (CourseName, Teacher, Credits, Description) 
VALUES (N'英语', N'王老师', 4, N'基础英语课程')
GO

-- 创建学生表
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),      -- 学生ID，主键自增
    StudentNo NVARCHAR(20) NOT NULL UNIQUE,       -- 学号，唯一
    Name NVARCHAR(50) NOT NULL,                   -- 学生姓名
    Gender NVARCHAR(10) NOT NULL,                 -- 性别
    BirthYear INT,                                -- 出生年份
    ClassID INT,                                  -- 班级ID，外键
    Phone NVARCHAR(20),                           -- 联系电话
    Address NVARCHAR(200),                        -- 家庭住址
    Status NVARCHAR(20) DEFAULT N'在读',           -- 学生状态
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    CONSTRAINT FK_Students_Classes FOREIGN KEY (ClassID) 
        REFERENCES Classes(ClassID)
)
GO

-- 插入学生测试数据
INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) 
VALUES ('S001', N'张三', N'男', 2015, 1, '13800000001', N'北京市朝阳区', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) 
VALUES ('S002', N'李四', N'女', 2015, 1, '13800000002', N'北京市海淀区', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) 
VALUES ('S003', N'王五', N'男', 2015, 1, '13800000003', N'北京市西城区', N'在读')
GO

-- ... 继续插入其他学生数据 ...

-- 创建成绩表
CREATE TABLE Scores (
    ScoreID INT PRIMARY KEY IDENTITY(1,1),        -- 成绩ID，主键自增
    StudentID INT,                                -- 学生ID，外键
    CourseID INT,                                 -- 课程ID，外键
    Score DECIMAL(5,2),                           -- 考试分数
    ExamTime BIGINT,                              -- 考试时间（时间戳）
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    CONSTRAINT FK_Scores_Students FOREIGN KEY (StudentID) 
        REFERENCES Students(StudentID),
    CONSTRAINT FK_Scores_Courses FOREIGN KEY (CourseID) 
        REFERENCES Courses(CourseID)
)
GO

-- 创建用户表
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),         -- 用户ID，主键自增
    Username NVARCHAR(50) NOT NULL UNIQUE,        -- 用户名，唯一
    Password NVARCHAR(100) NOT NULL,              -- 密码（MD5加密）
    RealName NVARCHAR(50),                        -- 真实姓名
    Role NVARCHAR(20),                            -- 用户角色
    Status BIT NOT NULL,                          -- 账号状态
    LastLoginTime BIGINT,                         -- 最后登录时间（时间戳）
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())
)
GO

-- 创建权限表
CREATE TABLE Permissions (
    PermissionID INT PRIMARY KEY IDENTITY(1,1),    -- 权限ID，主键自增
    PermissionName NVARCHAR(50) NOT NULL UNIQUE,   -- 权限名称
    PermissionCode NVARCHAR(50) NOT NULL UNIQUE,   -- 权限代码
    Description NVARCHAR(200),                     -- 权限描述
    Type NVARCHAR(20) NOT NULL,                    -- 权限类型
    ParentID INT,                                  -- 父权限ID
    Path NVARCHAR(100),                            -- 权限路径
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())
)
GO

-- 创建用户权限关联表
CREATE TABLE UserPermissions (
    UserPermissionID INT PRIMARY KEY IDENTITY(1,1), -- 主键ID
    UserID INT NOT NULL,                           -- 用户ID
    PermissionID INT NOT NULL,                     -- 权限ID
    CreateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    UpdateTime BIGINT NOT NULL DEFAULT DATEDIFF(SECOND, '1970-01-01', GETUTCDATE()),
    CONSTRAINT FK_UserPermissions_Users FOREIGN KEY (UserID) 
        REFERENCES Users(UserID),
    CONSTRAINT FK_UserPermissions_Permissions FOREIGN KEY (PermissionID) 
        REFERENCES Permissions(PermissionID)
)
GO

-- 插入默认管理员账号
INSERT INTO Users (Username, Password, RealName, Role, Status)
VALUES ('admin', 'e10adc3949ba59abbe56e057f20f883e', N'系统管理员', 'admin', 1)
GO

-- 插入权限数据
INSERT INTO Permissions (PermissionName, PermissionCode, Description, Type, ParentID, Path)
VALUES (N'系统管理', 'system:manage', N'系统管理模块', N'菜单', NULL, '/system')
GO

INSERT INTO Permissions (PermissionName, PermissionCode, Description, Type, ParentID, Path)
VALUES (N'用户管理', 'user:manage', N'用户管理功能', N'菜单', 1, '/system/user')
GO