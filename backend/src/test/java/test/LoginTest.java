/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package test;

import java.time.Duration;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 *
 * @author anhkt
 */
public class LoginTest {

    static WebDriver driver;

    @BeforeAll
    public static void setup() {
        System.setProperty("webdriver.edge.driver", "C:\\Users\\anhkt\\Downloads\\edgedriver_win64\\msedgedriver.exe");
        driver = new EdgeDriver();
    }

    @AfterAll
    public static void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testLoginSuccess() {
        driver.get("http://localhost:3000/register");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Email address']"))
                .sendKeys("anhktsnamkhanhcs14@gmail.com");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Username']"))
                .sendKeys("KhanhKhanh2k111");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Password']"))
                .sendKeys("123Khanh@123");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Confirm password']"))
                .sendKeys("123Khanh@123");

        driver.findElement(By.cssSelector("button.login-button[type='submit']"))
                .click();

        new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.urlToBe("http://localhost:3000/login"));

        Assertions.assertEquals("http://localhost:3000/login", driver.getCurrentUrl());
    }

    @Test
    public void CPasswordNotSamePassword() {
        driver.get("http://localhost:3000/register");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Email address']"))
                .sendKeys("anhktsnamkhanhcs14@gmail.com");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Username']"))
                .sendKeys("KhanhKhanh2k111");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Password']"))
                .sendKeys("123Khanh@123");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Confirm password']"))
                .sendKeys("123Khanh@12345678");

        driver.findElement(By.cssSelector("button.login-button[type='submit']"))
                .click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        WebElement msgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("p.message")
        ));
        
        String actualMessage = msgElement.getText();
        Assertions.assertEquals("Password phải trùng với Confirm password", actualMessage);
    }
    
    @Test
    public void PasswordNotIncludeUpperCase() {
        driver.get("http://localhost:3000/register");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Email address']"))
                .sendKeys("anhktsnamkhanhcs14@gmail.com");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Username']"))
                .sendKeys("KhanhKhanh2k111");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Password']"))
                .sendKeys("123khanh@123");

        driver.findElement(By.cssSelector("input.input-field[placeholder='Confirm password']"))
                .sendKeys("123khanh@123");

        driver.findElement(By.cssSelector("button.login-button[type='submit']"))
                .click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        WebElement msgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("p.message")
        ));
        
        String actualMessage = msgElement.getText();
        Assertions.assertEquals("Password phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.", actualMessage);
    }
}
