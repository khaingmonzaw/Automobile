              IDENTIFICATION DIVISION.
              PROGRAM-ID. CALC.
       
              DATA DIVISION.
              WORKING-STORAGE SECTION.
              *> Storage containers to hold the 7 input arguments from Node.js
              01  claim_amt            PIC 9(8).
              01  total_premium        PIC 9(8).
              01  assessed_amt         PIC 9(8).
              01  risk_lvl             PIC X(10).
              01  dob                  PIC X(10).
              01  driver_year          PIC 99.
              01  model_year           PIC 9(4).
              
              *> Added a default value so calculation comparison works
              01  deductible_amt       PIC 9(8) VALUE 00100000. 
              01  reducted_amt         PIC 9(8) VALUE ZERO.
              01  policy_amt           PIC 9(8) VALUE ZERO.
       
              01  medium_risk          PIC 9V99 VALUE 0.03.
              01  old_age              PIC 9V99 VALUE 0.03.
              01  inexperieced         PIC 9V99 VALUE 0.02.
              01  spare_rare           PIC 9V99 VALUE 0.02.
              01  service_tax          PIC 9V99 VALUE 0.05.
              01  temp1                PIC 9(8).
              01  temp2                PIC 9(4).
              01  temp3                PIC 99.
              01  temp4                PIC 9(4).
              01  year                 PIC X(4).
              01  month                PIC XX.
              01  birth_date           PIC XX.
              01  compensation_amt     PIC 9(8).
              01  percentage           PIC 999.
              
              01  WS-DATE              PIC X(21).
              01  WS-YEAR              PIC 9(4).
       
              01  WS-STATUS            PIC X(10) VALUE "APPROVED".
              01  WS-RISK-LVL          PIC X(10) VALUE "LOW".
              01  Remark_msg           PIC X(60) VALUE SPACE.
       
              PROCEDURE DIVISION.
                  *> 1. Accept the 7 parameters in sequential order from Node.js execution
                  ACCEPT claim_amt FROM ARGUMENT-VALUE.
                  ACCEPT total_premium FROM ARGUMENT-VALUE.
                  ACCEPT assessed_amt FROM ARGUMENT-VALUE.
                  ACCEPT risk_lvl FROM ARGUMENT-VALUE.
                  ACCEPT dob FROM ARGUMENT-VALUE.
                  ACCEPT driver_year FROM ARGUMENT-VALUE.
                  ACCEPT model_year FROM ARGUMENT-VALUE.
       
                  *> 2. Business Logic Evaluation
                  IF claim_amt > deductible_amt THEN
                      MOVE FUNCTION UPPER-CASE(risk_lvl) TO risk_lvl
                      
                     EVALUATE risk_lvl
                         WHEN "LOW"
                           MOVE assessed_amt TO reducted_amt                           
                         WHEN "MEDIUM"
                           COMPUTE temp1 = assessed_amt * medium_risk
                           COMPUTE reducted_amt = assessed_amt - temp1                          
                         WHEN "HIGH"
                           MOVE "REJECTED" TO WS-STATUS
                           MOVE 0 TO compensation_amt
                           MOVE 0 TO assessed_amt
                           MOVE "Risk level is high. Claim is rejected." 
                           TO Remark_msg
                           GO TO OUT-PARA
                     END-EVALUATE
       
                     PERFORM CHK-POL
                     MOVE "Claim is approved." TO Remark_msg
                     PERFORM RISK-ASSESSMENT
                     GO TO OUT-PARA
                  ELSE
                     MOVE "REJECTED" TO WS-STATUS
                     MOVE 0 TO compensation_amt
                     MOVE 0 TO assessed_amt
                     MOVE "Claim amount less than deductible. Rejected." 
                        TO Remark_msg
                     GO TO OUT-PARA
                  END-IF.
       
              OUT-PARA.
                  *> 3. Send comma-separated output directly back to Node's stdout split engine
                  DISPLAY FUNCTION TRIM(WS-STATUS) ","
                          FUNCTION TRIM(WS-RISK-LVL) ","
                          FUNCTION TRIM(compensation_amt) ","
                          FUNCTION TRIM(assessed_amt) ","
                          FUNCTION TRIM(Remark_msg).                          
       
                  STOP RUN.
       
              CHK-POL.
                  MOVE reducted_amt TO policy_amt.

                  MOVE FUNCTION CURRENT-DATE TO WS-DATE.
                  MOVE WS-DATE(1:4) TO WS-YEAR.

                  UNSTRING dob DELIMITED BY "-"
                      INTO year month birth_date
                  END-UNSTRING.
                  
                  MOVE FUNCTION NUMVAL(year) TO temp2.
                  COMPUTE temp4 = WS-YEAR - temp2.
                  IF temp4 > 60 THEN
                      COMPUTE temp1 = policy_amt * old_age
                      COMPUTE policy_amt = policy_amt - temp1
                  END-IF.
                  
                  IF driver_year < 3 THEN 
                      COMPUTE temp1 = policy_amt * inexperieced
                      COMPUTE policy_amt = policy_amt - temp1
                  END-IF.                 
                  
                  COMPUTE temp3 = WS-YEAR - model_year.
                  
                  IF temp3 > 24 OR temp3 = 0 THEN
                      COMPUTE temp1 = policy_amt * spare_rare
                      COMPUTE policy_amt = policy_amt - temp1
                  END-IF.
                  
                  COMPUTE temp1 = policy_amt * service_tax.
                  COMPUTE policy_amt = policy_amt - temp1.
                  
                  IF claim_amt < policy_amt THEN 
                      MOVE claim_amt TO compensation_amt
                  ELSE 
                      MOVE policy_amt TO compensation_amt
                  END-IF.
       
              RISK-ASSESSMENT.
              COMPUTE assessed_amt = assessed_amt - compensation_amt.
              COMPUTE percentage ROUNDED = 
              (assessed_amt / total_premium) * 100.
                  
              EVALUATE percentage
               WHEN 70 THRU 100
                   MOVE "LOW"    TO WS-RISK-LVL
               WHEN 31 THRU 69
                   MOVE "MEDIUM" TO WS-RISK-LVL
               WHEN OTHER
                   MOVE "HIGH"   TO WS-RISK-LVL
               END-EVALUATE.

              END PROGRAM CALC.
