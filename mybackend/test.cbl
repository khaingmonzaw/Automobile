       IDENTIFICATION DIVISION. 
       PROGRAM-ID. TEST.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-CUSTOMER-ID  PIC X(20).
       01 WS-CLAIM-DETAIL PIC X(100).
       
       PROCEDURE DIVISION.

       *> get cusid(argument1)
       DISPLAY 1 UPON ARGUMENT-NUMBER
       ACCEPT WS-CUSTOMER-ID FROM ARGUMENT-VALUE

       *> get claimdetail(argument2)
       DISPLAY 2 UPON ARGUMENT-NUMBER
       ACCEPT WS-CLAIM-DETAIL FROM ARGUMENT-VALUE

       *> sent data to sever.js
       DISPLAY WS-CUSTOMER-ID.
       DISPLAY WS-CLAIM-DETAIL.
       DISPLAY 
           '{"status":"success","customer":"' 
           FUNCTION TRIM(WS-CUSTOMER-ID) 
           '","message":"Claim received for: ' 
           FUNCTION TRIM(WS-CLAIM-DETAIL)
            '"}'.

       STOP RUN.
       