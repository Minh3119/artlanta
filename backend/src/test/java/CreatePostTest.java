
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import org.openqa.selenium.support.ui.ExpectedConditions;
public class CreatePostTest {
    WebDriver driver;

    @BeforeEach
    void setup() throws InterruptedException {
        System.setProperty("webdriver.chrome.driver", "D:/Tools/ChromeDriver/chromedriver.exe");
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:3000");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement openPostPopup= driver.findElement(By.id("test-create-btn"));
        openPostPopup.click();
        WebElement createPost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("test-create-post"))
        );
        createPost.click();
        Thread.sleep(1000);

        WebElement emailInput= driver.findElement(By.id("email-input"));
        emailInput.sendKeys("luongluong@gmail.com");
        WebElement pwInput= driver.findElement(By.id("pw-input"));
        pwInput.sendKeys("123");
        WebElement loginButton= driver.findElement(By.className("login-button"));
        loginButton.click();
        Thread.sleep(2000);
    }

    @Test
    void testCreatePostOneChar() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement openPostPopup= driver.findElement(By.id("test-create-btn"));
        openPostPopup.click();
        WebElement createPost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("test-create-post"))
        );
        createPost.click();
        Thread.sleep(1000);

        WebElement content = driver.findElement(By.className("content"));
        content.sendKeys("H");

        WebElement fileInput = driver.findElement(By.id("file"));
        fileInput.sendKeys("C:/Users/ADMIN/OneDrive/Pictures/ChrisTree.png");
        Thread.sleep(2000);

        WebElement createButton = driver.findElement(By.xpath("//button[text()='Create']"));
        createButton.click();

        Thread.sleep(3000);
        WebElement toast = driver.findElement(By.className("Toastify__toast"));
        Assertions.assertTrue(toast.getText().contains("completed"));
    }

    @Test
    void testCreatePostNoChar() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement openPostPopup= driver.findElement(By.id("test-create-btn"));
        openPostPopup.click();
        WebElement createPost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("test-create-post"))
        );
        createPost.click();
        Thread.sleep(1000);

        WebElement content = driver.findElement(By.className("content"));
        content.sendKeys("      ");
        Thread.sleep(2000);

        WebElement createButton = driver.findElement(By.xpath("//button[text()='Create']"));
        createButton.click();

        Thread.sleep(3000);
        WebElement toast = driver.findElement(By.className("Toastify__toast"));
        Assertions.assertFalse(toast.getText().contains("completed"));
    }

    @Test
    void testCreatePostMaxChar() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement openPostPopup= driver.findElement(By.id("test-create-btn"));
        openPostPopup.click();
        WebElement createPost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("test-create-post"))
        );
        createPost.click();
        Thread.sleep(1000);
        WebElement content = driver.findElement(By.className("content"));
        content.sendKeys("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
        Thread.sleep(3000);

        WebElement createButton = driver.findElement(By.xpath("//button[text()='Create']"));
        createButton.click();

        Thread.sleep(3000);
        WebElement toast = driver.findElement(By.className("Toastify__toast"));
        Assertions.assertTrue(toast.getText().contains("completed"));
    }

    @AfterEach
    void teardown() {
        driver.quit();
    }
}
