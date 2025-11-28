package com.arelore.dmsserver.dto;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
public class MysqlTableInfoDTO extends BaseDTO {
    /**
     * 表名称
     */
    private String name;

    /**
     * 所属数据库名
     */
    private String dbName;

    /**
     * 所属实例地址
     */
    private String instanceHost;

    /**
     * 行数
     */
    private Long rowCount;

    /**
     * 表大小
     */
    private String size;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getInstanceHost() {
        return instanceHost;
    }

    public void setInstanceHost(String instanceHost) {
        this.instanceHost = instanceHost;
    }

    public Long getRowCount() {
        return rowCount;
    }

    public void setRowCount(Long rowCount) {
        this.rowCount = rowCount;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}