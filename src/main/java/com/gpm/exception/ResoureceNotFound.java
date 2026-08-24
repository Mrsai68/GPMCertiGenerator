package com.gpm.exception;

public class ResoureceNotFound extends RuntimeException{

    public ResoureceNotFound(String msg){
        super(msg);
    }

    public ResoureceNotFound(){
        super("Resource Not Found !!");
    }
}
