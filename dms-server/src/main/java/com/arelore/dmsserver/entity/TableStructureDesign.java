package com.arelore.dmsserver.entity;

import com.baomidou.mybatisplus.annotation.TableName;

@TableName("table_structure_design_detail")
public class TableStructureDesign extends BaseEntity {
    
    /**
     * 工单ID
     */
    private Long workOrderId;
    
    /**
     * 表名
     */
    private String tableName;
    
    /**
     * 表描述
     */
    private String tableComment;
    
    /**
     * 字符集
     */
    private String charset;
    
    /**
     * 起始自增值
     */
    private Integer autoIncrementStart;
    
    /**
     * 列信息（JSON数组）
     */
    private String columnsInfo;
    
    /**
     * 索引信息（JSON数组）
     */
    private String indexesInfo;
    
    /**
     * 当前版本
     */
    private Integer currentVersion;
    
    /**
     * 操作类型
     */
    private String operateType;
    
    public Long getWorkOrderId() {
        return workOrderId;
    }
    
    public void setWorkOrderId(Long workOrderId) {
        this.workOrderId = workOrderId;
    }
    
    public String getTableName() {
        return tableName;
    }
    
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
    
    public String getTableComment() {
        return tableComment;
    }
    
    public void setTableComment(String tableComment) {
        this.tableComment = tableComment;
    }
    
    public String getCharset() {
        return charset;
    }
    
    public void setCharset(String charset) {
        this.charset = charset;
    }
    
    public Integer getAutoIncrementStart() {
        return autoIncrementStart;
    }
    
    public void setAutoIncrementStart(Integer autoIncrementStart) {
        this.autoIncrementStart = autoIncrementStart;
    }
    
    public String getColumnsInfo() {
        return columnsInfo;
    }
    
    public void setColumnsInfo(String columnsInfo) {
        this.columnsInfo = columnsInfo;
    }
    
    public String getIndexesInfo() {
        return indexesInfo;
    }
    
    public void setIndexesInfo(String indexesInfo) {
        this.indexesInfo = indexesInfo;
    }
    
    public Integer getCurrentVersion() {
        return currentVersion;
    }
    
    public void setCurrentVersion(Integer currentVersion) {
        this.currentVersion = currentVersion;
    }
    
    public String getOperateType() {
        return operateType;
    }
    
    public void setOperateType(String operateType) {
        this.operateType = operateType;
    }
}