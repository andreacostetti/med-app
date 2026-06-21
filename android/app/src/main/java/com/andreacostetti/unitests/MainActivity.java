package com.andreacostetti.unitests;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Recuperiamo la WebView nativa in cui gira la tua app Svelte
        WebView webView = this.bridge.getWebView();

        // 2. Disattiviamo brutalmente l'effetto "molla/bounce" a livello hardware
        if (webView != null) {
            webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        }
    }
}