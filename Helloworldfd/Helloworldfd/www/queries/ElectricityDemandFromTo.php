<?php

require ('connect_appuser.php');
$myDateFrom = $_POST['dateFrom'];
$myDateTo = $_POST['dateTo'];
function pullElectricityDemand($databaseConnection, $dateFrom, $dateTo)
{ 
    $queryElectricityDemand = 
        "SELECT MIN(Demand) AS UnitMin, MAX(Demand) AS UnitMax, NULL AS AvgUnit, NULL AS DateRecorded
        FROM ElectricityDemand
        UNION
        (SELECT NULL, NULL, AVG(Demand) AS AvgUnit, `Date/Time` AS DateRecorded
        FROM ElectricityDemand
        WHERE Buildings_idBuildings = 126 AND `Date/Time` >= STR_TO_DATE('". $dateFrom . "', '%m/%d/%Y') AND `Date/Time` <= STR_TO_DATE('". $dateTo . "', '%m/%d/%Y') 
        GROUP BY DateRecorded                                
        ORDER BY DateRecorded)";
   
   $results = mysqli_query($databaseConnection, $queryElectricityDemand);
   $info = array(array(), array(), array(), array());
    if ($results)
    {
        while($row = mysqli_fetch_array($results))
        {
            $info[0][] = $row['UnitMin'];
            $info[1][] = $row['UnitMax'];
            $info[2][] = $row['AvgUnit'];
            $info[3][] = $row['DateRecorded'];
        }
    }
   
   return $info; 
}

$pulledElectricityDemand = pullElectricityDemand($databaseConnection, $myDateFrom, $myDateTo);
echo json_encode($pulledElectricityDemand);

# THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
# INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
# OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
#  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
?>

