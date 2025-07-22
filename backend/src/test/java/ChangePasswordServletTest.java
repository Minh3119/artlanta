import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.openqa.selenium.chrome.ChromeOptions;


public class ChangePasswordServletTest {
    
    private static ChromeDriver driver;
    private static WebDriverWait wait;
    
    private void loginUser() {
        driver.get("http://localhost:3000/login");
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"root\"]/div[1]/div/form/div[1]/input")));
        WebElement passwordField = driver.findElement(By.xpath("//*[@id=\"root\"]/div[1]/div/form/div[2]/input"));
        WebElement loginButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div[1]/div/form/button"));
        emailField.sendKeys("john.doe1975@chingchong.com");
        passwordField.sendKeys("P@ssw0rd!123"); 
        loginButton.click();
        wait.until(ExpectedConditions.urlContains("http://localhost:3000"));
    }

   private void assertPasswordChangeResult(String expectedResult) {
       WebElement resultMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"root\"]/div[1]/div/div[2]/form/div[5]")));
       String actualMessage = resultMessage.getText();
       switch (expectedResult) {
           case "success" -> assertTrue(actualMessage.contains("Password changed successfully"));
           case "incorrect" -> assertTrue(actualMessage.contains("Old password is incorrect"));
           case "validation" -> assertTrue(actualMessage.contains("Password must be at least 8 characters, include uppercase, lowercase, number, and special character"));
           case "mismatch" -> assertTrue(actualMessage.contains("New password and confirm password do not match"));
           case "error" -> assertTrue(actualMessage.contains("Failed to change password.") || actualMessage.contains("Network error. Please try again later."));
           default -> fail("Unexpected result: " + expectedResult);
       } 
   }

    @BeforeEach
    public void openBrowser() throws InterruptedException {
        System.setProperty("webdriver.chrome.driver", "C:\\tools\\chromedriver-win64\\chromedriver.exe"); // Path to your chromedriver
        ChromeOptions options = new ChromeOptions();
        options.setBinary("C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"); // Path to Brave
        options.addArguments("--headless"); // Commented out to see browser window
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
        loginUser();
        driver.get("http://localhost:3000/settings/editpassword");
        Thread.sleep(1000);
    }
    
    @Test
    public void testPageTitle() {
        String expectedTitle = "Artlanta";
        String actualTitle = driver.getTitle();
        assertEquals(expectedTitle, actualTitle, "Page title should be 'Artlanta'");
    }
    
   @ParameterizedTest
   @CsvFileSource(resources = "/passworddata.csv", numLinesToSkip = 1)
   public void testPasswordChangeScenarios(String oldPass, String newPass, String confirmPass, String expectedResult) {
       WebElement oldPasswordField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"oldPassword\"]")));
       WebElement newPasswordField = driver.findElement(By.xpath("//*[@id=\"newPassword\"]"));
       WebElement confirmPasswordField = driver.findElement(By.xpath("//*[@id=\"confirmPassword\"]"));
       WebElement changePasswordButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div[1]/div/div[2]/div/button"));

       oldPasswordField.clear();
       newPasswordField.clear();
       confirmPasswordField.clear();

       oldPasswordField.sendKeys(oldPass);
       newPasswordField.sendKeys(newPass);
       confirmPasswordField.sendKeys(confirmPass);
       changePasswordButton.click();

       assertPasswordChangeResult(expectedResult);
       
       // Reset password back to original for next test
       if (expectedResult.equals("success")) {
           resetPasswordToOriginal();
       }
   }
   
   private void resetPasswordToOriginal() {
       // Navigate back to password change page if needed
       driver.get("http://localhost:3000/settings/editpassword");
       
       WebElement oldPasswordField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"oldPassword\"]")));
       WebElement newPasswordField = driver.findElement(By.xpath("//*[@id=\"newPassword\"]"));
       WebElement confirmPasswordField = driver.findElement(By.xpath("//*[@id=\"confirmPassword\"]"));
       WebElement changePasswordButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div[1]/div/div[2]/div/button"));

       oldPasswordField.clear();
       newPasswordField.clear();
       confirmPasswordField.clear();

       // Change back to original password
       oldPasswordField.sendKeys("ValidPassword123!"); // The new password that was just set
       newPasswordField.sendKeys("P@ssw0rd!123"); // Original password
       confirmPasswordField.sendKeys("P@ssw0rd!123"); // Original password
       changePasswordButton.click();
       
       // Wait for success message
       wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"root\"]/div[1]/div/div[2]/form/div[5]")));
   }

    @AfterEach
    public void closeBrowser() {
        driver.quit();
    }
    @AfterAll
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
