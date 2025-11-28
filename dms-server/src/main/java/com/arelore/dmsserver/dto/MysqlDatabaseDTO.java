package com.arelore.dmsserver.dto;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
public class MysqlDatabaseDTO extends BaseDTO {
    /**
     * 数据库名称
     */
    private String name;

    /**
     * 所属实例地址
     */
    private String instanceHost;

    /**
     * 数据库大小
     */
    private String size;

    /**
     * 表数量
     */
    private Integer tableCount;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstanceHost() {
        return instanceHost;
    }

    public void setInstanceHost(String instanceHost) {
        this.instanceHost = instanceHost;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getTableCount() {
        return tableCount;
    }

    public void setTableCount(Integer tableCount) {
        this.tableCount = tableCount;
    }
}