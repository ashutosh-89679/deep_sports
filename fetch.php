<?php

include 'database.php';

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

function separateDates($dateRange) {
    $dates = explode(" - ", $dateRange);
    if (count($dates) === 2) {
        list($startDate, $endDate) = $dates;
        return array('start_date' => $startDate, 'end_date' => $endDate);
    } else {
        return null; 
    }
}


if(isset($data)){
    file_put_contents('headerx.txt' , $json_data);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS, PATCH");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit();
}


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS, PATCH");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit();
}


$projectIDS = null;
$configurations = null;
$sourced_by = null;
$closed_by = null;
$closure_date = null;
$ba2Date = null;
$ba3Date = null;
$sdrDate = null;
$invoice_status = null;
$invoice_post_raise_status = null;
$deal_status = null;


$av_desc = false;
$av_asc = false;
$recent_f_desc = false;
$recent_f_asc = false;
$closure_desc = false;
$closure_asc = false;
$recent_f = false;
$inv_no_desc = false;
$inv_no_asc = false;
$inv_amt_desc = false;
$inv_amt_asc = false;
$raise_date_desc = false;
$raise_date_asc = false;
$expected_desc = false;
$expected_asc = false;


$bookingIDSarray = [];


$conditionarr = array();

if (isset($data['name_number'])) {
    $nameNumber = $data['name_number'];
if (!empty($nameNumber)){
    $conditionarr[] = " bd.client_id IN (SELECT User_id FROM booked_clients WHERE name LIKE '%$nameNumber%' OR number LIKE '%$nameNumber%')";
    }
}

if (isset($data['project_ids'])) {
   $projectIDS = $data['project_ids'];
    if (!empty($projectIDS)){
    $conditionarr[] = "bd.project_id  IN ($projectIDS)";
   }
}

if (isset($data['configurations'])) {
   $configurations = $data['configurations'];
   if (!empty($configurations) || $configurations !== ""){
   $conditionarr[] = "bd.configuration_id  IN ($configurations)";
   }
}

if (isset($data['sourced_by'])) {
   $sourced_by  = $data['sourced_by'];
   if (!empty($sourced_by)){
   $conditionarr[] = "bd.sourced_by  IN ($sourced_by)";
   }
}

if (isset($data['closed_by'])) {
    $closed_by  = $data['closed_by'];
    if (!empty($closed_by)){
   $conditionarr[] = "bd.closed_by  IN ($closed_by)";
   }
}

if (isset($data['followup_date'])){
    $followupDate = $data['followup_date'];
    if(!empty($followupDate) || $followupDate !== "" || $followupDate !== null){
        $followupDateArray = separateDates($followupDate);
        $fStartDate = $followupDateArray['start_date'];
        $fEndDate = $followupDateArray['end_date'];
        if($fStartDate !== $fEndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id FROM followups WHERE followup_date BETWEEN '$fStartDate' AND '$fEndDate')";
        }
        else if ($fStartDate == $fEndDate){
             $conditionarr[] = "bd.booking_id IN (SELECT booking_id FROM followups WHERE followup_date = '$fStartDate')";
        }
    }
}

if(isset($data['agreement_range'])){
    $agreement_range = $data['agreement_range'];
    
    if (!empty($agreement_range) && $agreement_range !== "undefined - undefined") {
       // echo $agreement_range;
    list($min, $max) = explode(' - ', $agreement_range);
    $min = intval($min);
    $max = intval($max);
    $conditionarr[] = "bd.agreement_value BETWEEN '$min' AND '$max' ";
}

    
}

if (isset($data['closure_date'])) {
    $closure_date = $data['closure_date'];
     if (!empty($closure_date) || $closure_date !== "" || $closure_date !== null){
    $closureDateArray = separateDates($closure_date);
    if($closureDateArray !== null){
        $closure_start_date = $closureDateArray['start_date'];
        $closure_end_date = $closureDateArray['end_date'];
        if($closure_start_date !== $closure_end_date){
             $conditionarr[] = "bd.closure_date  BETWEEN '$closure_start_date' AND '$closure_end_date' ";
          
        } elseif ($closure_start_date === $closure_end_date){
            $conditionarr[] = "bd.closure_date  = '$closure_start_date' ";
        }
    }
}
}

if (isset($data['ba1_date'])) {
    $ba1Date = $data['ba1_date'];
      if($ba1Date !== null || $ba1Date !== ""){
    $ba1DateArray = separateDates($ba1Date);
    if($ba1DateArray !== null){
        $ba1StartDate = $ba1DateArray['start_date'];
        $ba1EndDate = $ba1DateArray['end_date'];
        if($ba1StartDate !== $ba1EndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 1 AND completed_date  BETWEEN '$ba1StartDate' AND '$ba1EndDate')";
        }elseif ($ba1StartDate === $ba1EndDate){
                 $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 1 AND completed_date = '$ba1StartDate')";
        }
    }
  }
}

if (isset($data['ba2_date'])) {
    $ba2Date = $data['ba2_date'];
      if($ba2Date !== null || $ba2Date !== ""){
    $ba2DateArray = separateDates($ba2Date);
    if($ba2DateArray !== null){
        $ba2StartDate = $ba2DateArray['start_date'];
        $ba2EndDate = $ba2DateArray['end_date'];
        if($ba2StartDate !== $ba2EndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 2 AND completed_date  BETWEEN '$ba2StartDate' AND '$ba2EndDate')";
        }elseif ($ba2StartDate === $ba2EndDate){
             $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 2 AND completed_date  = '$ba2StartDate')";
        }
    }
  }
}

if (isset($data['sdr_date'])) {
    $sdrDate = $data['sdr_date'];
    if($sdrDate !== null || $sdrDate !== ""){
    $sdrDateArray = separateDates($sdrDate);
    if($sdrDateArray !== null){
        $sdrStartDate = $sdrDateArray['start_date'];
        $sdrEndDate = $sdrDateArray['end_date'];
        if($sdrStartDate !== $sdrEndDate){
             $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 3 AND completed_date  BETWEEN '$sdrStartDate' AND '$sdrEndDate')";
        }elseif ($sdrStartDate === $sdrEndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 3 AND completed_date  = '$sdrStartDate')";
        }
    }
    
}
    
}

if (isset($data['composite_payment'])) {
    $composite_payment = $data['composite_payment'];
    if($composite_payment !== null || $composite_payment !== ""){
    $composite_paymentDateArray = separateDates($composite_payment);
    if($composite_paymentDateArray !== null){
        $compositeStartDate = $composite_paymentDateArray['start_date'];
        $compositeEndDate = $composite_paymentDateArray['end_date'];
        if($compositeStartDate !== $compositeEndDate){
             $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 4 AND completed_date  BETWEEN '$compositeStartDate' AND '$compositeEndDate')";
        }elseif ($compositeStartDate === $compositeEndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 4 AND completed_date  = '$compositeStartDate')";
        }
    }
    
}
    
}

if (isset($data['ba3_date'])) {
    $ba3Date = $data['ba3_date'];
    if($ba3Date !== null || $ba3Date !== ""){
    $ba3DateArray = separateDates($ba3Date);
    if($ba3DateArray !== null){
        $ba3StartDate = $ba3DateArray['start_date'];
        $ba3EndDate = $ba3DateArray['end_date'];
        if($ba3StartDate !== $ba3EndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 5 AND completed_date  BETWEEN '$ba3StartDate' AND '$ba3EndDate')";
        }elseif ($ba3StartDate === $ba3EndDate){
            $conditionarr[] = "bd.booking_id IN (SELECT booking_id
                               FROM ob_status_records2 
                               WHERE status_id = 5 AND completed_date  = '$ba3StartDate')";
        }
    }
    
}
}

if (isset($data['invoice_status'])) {
    $invoice_status = $data['invoice_status'];
    $conditionarr[] = "bd.client_id IN ( SELECT inv.client_id FROM invoice inv WHERE inv.raise_status_id IN ($invoice_status) )";
}

if (isset($data['invoice_post_raise_status']) && !empty($data['invoice_post_raise_status'])) {
    $invoice_post_raise_status = $data['invoice_post_raise_status'];
   // echo "this->" . $invoice_post_raise_status;

    $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.post_raise_id IN ($invoice_post_raise_status)
              ) )";
}

if(isset($data['raise_Date']) && !empty($data['raise_Date'])){
    $raiseDate = $data['raise_Date'];
    if (!empty($raiseDate) || $raiseDate !== "" || $raiseDate !== null){
        $raiseDateArray = separateDates($raiseDate);
        if($raiseDateArray !== null){
            $raise_start_date = $raiseDateArray['start_date'];
            $raise_end_date = $raiseDateArray['end_date'];
            if($raise_start_date !== $raise_end_date){
                
            $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.invoice_raise_date BETWEEN '$raise_start_date' AND '$raise_end_date' AND (inv.post_raise_id = 2 OR  inv.post_raise_id = 1)
              ) )";
              
            } else if ($raise_start_date === $raise_end_date){
                $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.invoice_raise_date = '$raise_start_date' AND (inv.post_raise_id = 2 OR  inv.post_raise_id = 1)
              ) )";
            }
        }
    }
    
}

if(isset($data['submitted_Date']) && !empty($data['submitted_Date'])){
    $submitted_Date = $data['submitted_Date'];
    if (!empty($submitted_Date) || $submitted_Date !== "" || $submitted_Date !== null){
        $submitted_DateArray = separateDates($submitted_Date);
        if($submitted_DateArray !== null){
            $submit_start_date = $submitted_DateArray['start_date'];
            $submit_end_date = $submitted_DateArray['end_date'];
            if($submit_start_date !== $submit_end_date){
                
            $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.submit_date BETWEEN '$submit_start_date' AND '$submit_end_date' AND inv.post_raise_id = 2 
              ) )";
              
            } else if ($submit_start_date === $submit_end_date){
                $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.submit_date = '$submit_start_date' AND inv.post_raise_id = 2 
              ) )";
            }
        }
    }
    
}

if(isset($data['received_Date']) && !empty($data['received_Date'])){
    $received_Date = $data['received_Date'];
    if (!empty($received_Date) || $received_Date !== "" || $received_Date !== null){
        $received_DateArray = separateDates($received_Date);
        if($received_DateArray !== null){
            $received_start_date = $received_DateArray['start_date'];
            $received_end_date = $received_DateArray['end_date'];
            if($received_start_date !== $received_end_date){
                
            $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.received_date BETWEEN '$received_start_date' AND '$received_end_date'
              ) )";
              
            } else if ($received_start_date === $received_end_date){
                $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.received_date = '$received_start_date'
              ) )";
            }
        }
    }
    
}

if(isset($data['expected_Date']) && !empty($data['expected_Date'])){
    $expected_Date = $data['expected_Date'];
    if (!empty($expected_Date) || $expected_Date !== "" || $expected_Date !== null){
        $expected_DateArray = separateDates($expected_Date);
        if($expected_DateArray !== null){
            $expected_start_date = $expected_DateArray['start_date'];
            $expected_end_date = $expected_DateArray['end_date'];
            if($expected_start_date !== $expected_end_date){
                
            $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.expected_receive_date BETWEEN '$expected_start_date' AND '$expected_end_date' AND inv.post_raise_id = 2 
              ) )";
              
            } else if ($expected_start_date === $expected_end_date){
                $conditionarr[] = "bd.booking_id IN ( SELECT bd.booking_id 
              FROM booking_details bd 
              WHERE bd.client_id IN (
                  SELECT inv.client_id 
                  FROM invoice inv 
                  WHERE inv.expected_receive_date = '$expected_start_date' AND inv.post_raise_id = 2 
              ) )";
            }
        }
    }
    
}

if(isset($data['user_active']) && !empty($data['user_active'])){
    $user_active = $data['user_active'];
    $conditionarr[] = "bd.client_active = '$user_active'";
}

if (isset($data['ba_status'])){
    $ba_status = $data['ba_status'];
    if($ba_status !== null || !empty($ba_status)){
            $conditionarr[] = "osr.status_id =  $ba_status";
    }
}

if (isset($data['av_desc']) && !empty($data['av_desc']) && $data['av_desc'] === "True") {
    $av_desc = true;
}

if (isset($data['av_asc']) && !empty($data['av_asc']) && $data['av_asc'] === "True") {
    $av_asc = true;
}

if (isset($data['recent_f_desc']) && !empty($data['recent_f_desc']) && $data['recent_f_desc'] === "True") {
    $recent_f_desc = true;
}

if (isset($data['recent_f_asc']) && !empty($data['recent_f_asc']) && $data['recent_f_asc'] === "True") {
    $recent_f_asc = true;
}

if (isset($data['closure_desc']) && !empty($data['closure_desc']) && $data['closure_desc'] === "True") {
    $closure_desc = true;
}

if (isset($data['closure_asc']) && !empty($data['closure_asc']) && $data['closure_asc'] === "True") {
    $closure_asc = true;
}

if (isset($data['recent_f']) && !empty($data['recent_f']) && $data['recent_f'] === "True") {
    $recent_f = true;
}

if (isset($data['inv_no_desc']) && !empty($data['inv_no_desc']) && $data['inv_no_desc'] === "True") {
    $inv_no_desc = true;
}

if (isset($data['inv_no_asc']) && !empty($data['inv_no_asc']) && $data['inv_no_asc'] === "True") {
    $inv_no_asc = true;
}

if (isset($data['inv_amt_desc']) && !empty($data['inv_amt_desc']) && $data['inv_amt_desc'] === "True") {
    $inv_amt_desc = true;
}

if (isset($data['inv_amt_asc']) && !empty($data['inv_amt_asc']) && $data['inv_amt_asc'] === "True") {
    $inv_amt_asc = true;
}

if (isset($data['raise_date_desc']) && !empty($data['raise_date_desc']) && $data['raise_date_desc'] === "True") {
    $raise_date_desc = true;
}

if (isset($data['raise_date_asc']) && !empty($data['raise_date_asc']) && $data['raise_date_asc'] === "True") {
    $raise_date_asc = true;
}

if (isset($data['expected_desc']) && !empty($data['expected_desc']) && $data['expected_desc'] === "True") {
    $expected_desc = true;
}

if (isset($data['expected_asc']) && !empty($data['expected_asc']) && $data['expected_asc'] === "True") {
    $expected_asc = true;
}


$booking_records = array(); 

$page = isset($_GET['page']) ? max(1, $_GET['page']) : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

 
$sql2 = "SELECT
    bd.*,
    bc.name,
    bc.number,
    p.project_name,
    osr.status_id,
    osr.completed_date,
    osr.status_id,
    bd.client_id,
    bd.client_active,
    bd.ladder_stage,
    bd.base_brokerage,
    bd.kicker_percent,
    bd.kicker_value,
    bd.ei_percent,
    bd.ei_value
FROM
    booking_details bd
JOIN booked_clients bc ON
    bd.client_id = bc.User_id
JOIN project p ON
    bd.project_id = p.project_id
JOIN (
    SELECT
        ob_record_id,
        booking_id,
        status_id,
        completed_date
    FROM
        ob_status_records2 osr
    WHERE
        (booking_id, completed_date) IN (
            SELECT
                booking_id,
                MAX(completed_date)
            FROM
                ob_status_records2
            GROUP BY
                booking_id
        )
) osr ON
    bd.booking_id = osr.booking_id";

//if (!empty($bookingIDSarray)) {
//    $bookingIDString = implode(',', $bookingIDSarray);
//    $sql2 .= " WHERE bd.booking_id IN ($bookingIDString)";
//}

if( count($conditionarr) > 0 && !empty($conditionarr)){
    $sql2 .= " WHERE " . implode(" AND ", $conditionarr);
}

//echo $sql2;
    
$result2 = $conn->query($sql2);

if($result2){
    $totalCount = mysqli_num_rows($result2);
     if ($page * $limit > $totalCount) {
        $limit = $totalCount % $limit;
     }
}

$fetched_ladder_percent = null;
$fetched_kicker_percent = null;
$fetched_ei_percent = null;
$fetched_brokerage_percent = null;
$developer_name = null;
$location_name = null;
$developer_name = null;

$sql = "SELECT 
    bd.*,
    bc.name,
    bc.number,
    p.project_name,
    osr.status_id,
    osr.completed_date,
    bd.client_id,
    bd.client_active,
    bd.ladder_stage,
    bd.base_brokerage,
    bd.kicker_percent,
    bd.kicker_value,
    bd.ei_percent,
    bd.aop_percent,
    bd.cp_friendly,
    bd.token_amount,
    bd.ei_value,
    d.developer_name,
    (SELECT i.invoice_value FROM invoice i WHERE i.client_id = bd.client_id ORDER BY i.invoice_raise_date DESC , i.invoice_number DESC LIMIT 1) AS latest_invoice_value,
    (SELECT i.invoice_number FROM invoice i WHERE i.client_id = bd.client_id ORDER BY i.invoice_raise_date DESC , i.invoice_number DESC LIMIT 1) AS latest_invoice_number,
     (SELECT i.invoice_type FROM invoice i WHERE i.client_id = bd.client_id ORDER BY i.invoice_raise_date DESC , i.invoice_number DESC LIMIT 1) AS latest_invoice_type,
    (SELECT i.expected_receive_date FROM invoice i WHERE i.client_id = bd.client_id ORDER BY i.invoice_raise_date DESC , i.invoice_number DESC LIMIT 1) AS expected_date,
    (SELECT i.invoice_raise_date FROM invoice i WHERE i.client_id = bd.client_id ORDER BY i.invoice_raise_date DESC , i.invoice_number DESC LIMIT 1) AS raise_date
FROM
    booking_details bd
JOIN booked_clients bc ON
    bd.client_id = bc.User_id
JOIN project p ON
    bd.project_id = p.project_id
JOIN (
    SELECT
        ob_record_id,
        booking_id,
        status_id,
        completed_date
    FROM
        ob_status_records2 osr
    WHERE
        (booking_id, completed_date) IN (
            SELECT
                booking_id,
                MAX(completed_date)
            FROM
                ob_status_records2
            GROUP BY
                booking_id
        )
) osr ON
    bd.booking_id = osr.booking_id
LEFT JOIN company c ON 
    p.company_id = c.company_id
LEFT JOIN developer d ON 
    c.developer_id = d.developer_id

     ";
    

// if (!empty($bookingIDSarray)) {
//  $bookingIDString = implode(',', $bookingIDSarray);
//  $sql2 .= " WHERE bd.booking_id IN ($bookingIDString)";
//}

if( count($conditionarr) > 0 && !empty($conditionarr)){
    $sql .= " WHERE " . implode(" AND ", $conditionarr);
} 

//else {
//    $sql .= " ORDER BY bd.closure_date DESC";
//}
    
if ($av_desc) {
    $sql .= " ORDER BY bd.agreement_value DESC";
} 

if ($av_asc) {
    $sql .= " ORDER BY bd.agreement_value ASC";
}

if($closure_desc ){
    $sql .= " ORDER BY bd.closure_date DESC";
}

if($closure_asc){
    $sql .= " ORDER BY bd.closure_date ASC";
}

if($inv_no_desc){
     $sql .= " ORDER BY latest_invoice_number DESC";
}

if($inv_no_asc){
     $sql .= " ORDER BY latest_invoice_number ASC";
}

if($inv_amt_desc){
     $sql .= " ORDER BY latest_invoice_value DESC";
}

if($inv_amt_asc){
     $sql .= " ORDER BY latest_invoice_value ASC";
}

if($raise_date_desc){
     $sql .= " ORDER BY raise_date DESC";
}

if($raise_date_asc){
     $sql .= " ORDER BY raise_date ASC";
}

if($expected_desc){
     $sql .= " ORDER BY expected_date DESC";
}

if($expected_asc){
     $sql .= " ORDER BY expected_date ASC";
}


$sql .= " LIMIT $limit OFFSET $offset ";
//$sql .= " ORDER BY bd.closure_date DESC";

error_log($sql);

$result = $conn->query($sql);


if (!$result) {
    die("Query failed: " . $conn->error);
}


$booking_records['total_count'] = ['count' => $totalCount];


while ($row = $result->fetch_assoc()) {
    $generic_details = array(
        "booking_id" => $row["booking_id"],
        "client_id" => $row["client_id"],
        "project_id" => $row["project_id"],
        "wing" => $row["wing"],
        "flat_no" => $row["flat_no"],
        "cp_friendly" => $row["cp_friendly"],
        "configuration_id" => $row["configuration_id"],
        "carpet_area" => $row["carpet_area"],
        "closure_date" => $row["closure_date"],
        "closed_by" => $row["closed_by"],
        "sourced_by" => $row["sourced_by"],
        "cashback_amount" => $row["cashback_amount"],
        "agreement_value" => $row["agreement_value"],
        "csop" => $row["csop"],
        "name" => $row["name"],
        "number" => $row["number"],
        "active" => $row["client_active"],
        "token_amount" => $row["token_amount"],
        "latest_invoice_value" => $row["latest_invoice_value"],
        "latest_invoice_number" => $row["latest_invoice_number"],
        "latest_invoice_type" => $row["latest_invoice_type"],
        "expected_date" => $row["expected_date"],
        "raise_date" => $row["raise_date"],
        "project_name" => $row["project_name"],
        "developer_name" => $row["developer_name"]
    );

    $ob_status_details = array(
        "os_status_id" => $row["os_status_id"],
        "status_id" => $row["status_id"],
        "completed" => $row["completed_date"]
    );

    

    $project_id = $row["project_id"];
    $closure_date = $row["closure_date"];
    $booking_id = $row["booking_id"];
    $client_id = $row["client_id"];
    $fetched_ladder_percent = $row["ladder_stage"];
    $fetched_brokerage_percent = $row['base_brokerage'];
    $fetched_kicker_percent = $row['kicker_percent'];
    $fetched_kicker_value = $row['kicker_value'];
    $fetched_ei_percent = $row["ei_percent"];
    $fetched_ei_value = $row['ei_value'];
    $fetched_aop = $row['aop_percent'];
    
    

   //FETCH THE LOCATION AND DEVELOPER_NAME 
    if ($project_id !== null) {
    
        $developer_sql = "SELECT c.company_name, d.developer_name, l.location_name FROM project AS p JOIN company AS c 
                          ON p.company_id = c.company_id JOIN developer AS d ON c.developer_id = d.developer_id 
                          JOIN location AS l ON d.location_id = l.location_id WHERE p.project_id = '$project_id'";
        $result_developer_name = $conn->query($developer_sql);
        if ($result_developer_name) {
            while ($result_row = $result_developer_name->fetch_assoc()) {
                $developer_name = $result_row['developer_name'];
                $company_name = $result_row['company_name'];
                $location_name = $result_row['location_name'];
                        }
                    }
                
    }
    
    
    
    //GET THE INVOICE COUNT
   // $invoiceCountSQL = "SELECT COUNT(*) AS inv_count FROM invoice WHERE `client_id` = '$client_id' ";
   // $invoiceCountResult = $conn->query($invoiceCountSQL);
   // if($invoiceCountResult){
   //     while ($invoiceCountRow = $invoiceCountResult->fetch_assoc()) {
   //         $generic_details["inv_count"] = $invoiceCountRow['inv_count'];
   //     }
   // }
    


    // Create a booking record array
    $booking_record = array(
        'generic_details' => $generic_details,
        'ob_status_details' => $ob_status_details,
        'fetched_ladder_percent' => $fetched_ladder_percent,
        'fetched_kicker_percent' => $fetched_kicker_percent,
        'kicker_value' => $fetched_kicker_value,
        'ei_value' => $fetched_ei_value,
        'fetched_ei_percent' => $fetched_ei_percent,
        'fetched_brokerage_percent' => $fetched_brokerage_percent,
        'company_name' => $company_name,
        'developer_name' => $developer_name,
        'location_name' => $location_name,
        'aop_percent' => $fetched_aop
    );

    $booking_records[] = $booking_record;
}
$booking_records = array_values($booking_records);


header("Content-Type: application/json");
echo json_encode($booking_records);


?>