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
INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S001', N'张三', N'男', 2015, 1, '13800000001', N'北京市朝阳区望京街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S002', N'李四', N'女', 2015, 1, '13800000002', N'北京市海淀区中关村街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S003', N'王五', N'男', 2015, 2, '13800000003', N'北京市西城区西单街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S004', N'赵六', N'女', 2015, 2, '13800000004', N'北京市东城区东直门街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S005', N'孙七', N'男', 2014, 3, '13800000005', N'北京市丰台区方庄街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S006', N'周八', N'女', 2014, 3, '13800000006', N'北京市石景山区八角街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S007', N'吴九', N'男', 2014, 4, '13800000007', N'北京市通州区梨园街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S008', N'郑十', N'女', 2014, 4, '13800000008', N'北京市大兴区亦庄街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S009', N'刘一', N'男', 2013, 5, '13800000009', N'北京市昌平区回龙观街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S010', N'陈二', N'女', 2013, 5, '13800000010', N'北京市顺义区后沙峪街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S011', N'杨晓明', N'男', 2015, 1, '13800000011', N'北京市朝阳区三里屯街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S012', N'王丽丽', N'女', 2015, 1, '13800000012', N'北京市海淀区五道口街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S013', N'李明明', N'男', 2015, 2, '13800000013', N'北京市西城区金融街', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S014', N'张婷婷', N'女', 2015, 2, '13800000014', N'北京市东城区王府井', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S015', N'刘强', N'男', 2014, 3, '13800000015', N'北京市丰台区花乡街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S016', N'周梅', N'女', 2014, 3, '13800000016', N'北京市石景山区古城街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S017', N'吴涛', N'男', 2014, 4, '13800000017', N'北京市通州区新华街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S018', N'郑雪', N'女', 2014, 4, '13800000018', N'北京市大兴区黄村街道', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S019', N'马超', N'男', 2013, 5, '13800000019', N'北京市昌平区天通苑', N'在读')
GO

INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status) VALUES 
('S020', N'韩雪', N'女', 2013, 5, '13800000020', N'北京市顺义区空港街道', N'在读')
GO

-- ... 继续插入其他学生数据 ...

-- 删除触发器
IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[TR_Users_UpdateTime]'))
BEGIN
    DROP TRIGGER [dbo].[TR_Users_UpdateTime]
END
GO

-- 创建用户表
CREATE TABLE [dbo].[Users] (
    [UserID] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](50) NOT NULL,
    [Password] [nvarchar](100) NOT NULL,          -- 存储 bcrypt 哈希
    [RealName] [nvarchar](100) NOT NULL,
    [Role] [nvarchar](20) NOT NULL CONSTRAINT [DF_Users_Role] DEFAULT ('user'),
    [Status] [bit] NOT NULL CONSTRAINT [DF_Users_Status] DEFAULT (1),
    [LastLoginTime] [bigint] NULL,
    [CreateTime] [bigint] NOT NULL CONSTRAINT [DF_Users_CreateTime] DEFAULT (DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())),
    [UpdateTime] [bigint] NOT NULL CONSTRAINT [DF_Users_UpdateTime] DEFAULT (DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())),
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserID] ASC),
    CONSTRAINT [UQ_Users_Username] UNIQUE NONCLUSTERED ([Username] ASC)
)
GO

-- 创建更新时间触发器
CREATE TRIGGER [dbo].[TR_Users_UpdateTime]
ON [dbo].[Users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Users]
    SET [UpdateTime] = DATEDIFF(SECOND, '1970-01-01', GETUTCDATE())
    FROM [dbo].[Users] u
    INNER JOIN inserted i ON u.[UserID] = i.[UserID]
END
GO

-- 创建管理员账号（密码：123456）
INSERT INTO [dbo].[Users] ([Username], [Password], [RealName], [Role], [Status])
VALUES ('admin', '$2a$10$X8VIET1jGBQRyU.bpgxX.OBhgq3sKztXqNX7XFXV0TC0Z5EEzW3Pu', N'系统管理员', 'admin', 1)
GO

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

-- 插入权限数据
INSERT INTO Permissions (PermissionName, PermissionCode, Description, Type, ParentID, Path)
VALUES (N'系统管理', 'system:manage', N'系统管理模块', N'菜单', NULL, '/system')
GO

INSERT INTO Permissions (PermissionName, PermissionCode, Description, Type, ParentID, Path)
VALUES (N'用户管理', 'user:manage', N'用户管理功能', N'菜单', 1, '/system/user')
GO