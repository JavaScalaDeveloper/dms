package com.arelore.dmsserver.dto;

public class SchemaDesignWorkOrderDTO extends BaseDTO {

    private String projectName;

    private String databaseType;

    private String changeBaseline;

    private String relatedPerson;

    private String projectBackground;

    private String status;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(String databaseType) {
        this.databaseType = databaseType;
    }

    public String getChangeBaseline() {
        return changeBaseline;
    }

    public void setChangeBaseline(String changeBaseline) {
        this.changeBaseline = changeBaseline;
    }

    public String getRelatedPerson() {
        return relatedPerson;
    }

    public void setRelatedPerson(String relatedPerson) {
        this.relatedPerson = relatedPerson;
    }

    public String getProjectBackground() {
        return projectBackground;
    }

    public void setProjectBackground(String projectBackground) {
        this.projectBackground = projectBackground;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

