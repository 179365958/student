-- 先删除引用 Users 表的外键约束
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserPermissions_Users]') AND type in (N'F'))
BEGIN
    ALTER TABLE [dbo].[UserPermissions] DROP CONSTRAINT [FK_UserPermissions_Users]
END
GO

-- 删除触发器
IF EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[TR_Users_UpdatedAt]'))
BEGIN
    DROP TRIGGER [dbo].[TR_Users_UpdatedAt]
END
GO

-- 删除旧表
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Users]
END
GO

-- 创建新的用户表
CREATE TABLE [dbo].[Users] (
    [UserID] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](50) NOT NULL,
    [Password] [nvarchar](100) NOT NULL,
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

-- 重新创建触发器
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

-- 重新创建外键约束
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPermissions')
BEGIN
    ALTER TABLE [dbo].[UserPermissions]
    ADD CONSTRAINT [FK_UserPermissions_Users] 
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
END
GO

-- 创建管理员账号（密码：123456）
INSERT INTO [dbo].[Users] ([Username], [Password], [RealName], [Role], [Status])
VALUES ('admin', '$2a$10$ZHVsbmluaXN0cmF0b3JwYOKjBN9Y9Y9Y9Y9Y9Y9Y9Y9Y9Y9Y', N'系统管理员', 'admin', 1)
GO
