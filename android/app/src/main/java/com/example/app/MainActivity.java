package com.example.app;
import android.view.KeyEvent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;


import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // This is the main activity for the Android app
    // It extends BridgeActivity which is part of the Capacitor framework
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       // Add JavaScript interface for exitApp 
       // This allows JavaScript to call the exitApp method
       // from the native Android code
        this.getBridge().getWebView().addJavascriptInterface(new Object() {
        @JavascriptInterface
        public void exitApp() {
                runOnUiThread(() -> finish());
            }
        }, "NativeBridge");
    }

    // Override the onKeyDown method to handle the back button press
    // This method is called when the back button is pressed
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Handle the back button press
        if (keyCode == KeyEvent.KEYCODE_BACK) {
           bridge.eval("window.dispatchEvent(new Event('hardware-back-button'));", null);
           return true; // Indicate that the event was handled
        }
        return super.onKeyDown(keyCode, event);
    }
}
