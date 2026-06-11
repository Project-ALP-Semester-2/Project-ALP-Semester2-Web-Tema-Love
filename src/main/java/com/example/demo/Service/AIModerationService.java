package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIModerationService {

    @Value("${openrouter.api.key}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String MODEL_NAME = "google/gemma-4-31b-it:free";
    
    public AIModerationService() {
        this.restTemplate = new RestTemplate();
    }
    
    public boolean isTextToxic(String text) {
        if (text == null || text.trim().isEmpty()) return false;
        
        try {
            String prompt = buildModerationPrompt(text);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL_NAME);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", 
                    "You are a multilingual content safety classifier. Output ONLY SAFE or UNSAFE. Be strict. Apply all decoding rules."),
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("temperature", 0);
            requestBody.put("max_tokens", 10);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:8080");
            
            ResponseEntity<Map> response = restTemplate.exchange(
                API_URL,
                HttpMethod.POST,
                new HttpEntity<>(requestBody, headers),
                Map.class
            );
            
            String result = parseResponse(response.getBody());
            System.out.println("🤖 AI: " + result);
            
            boolean isToxic = "UNSAFE".equals(result);
            System.out.println(isToxic ? "🔴 TOXIC - DIBLOKIR" : "✅ AMAN - LOLOS");
            
            return isToxic;
            
        } catch (Exception e) {
            System.err.println("API Error: " + e.getMessage());
            return false;
        }
    }
    
    private String buildModerationPrompt(String text) {
        return "You are a multilingual content safety classifier. Detect UNSAFE content in ANY language or writing style.\n\n" +
               "=== WHAT IS UNSAFE ===\n" +
               "A text is UNSAFE if it contains ANY of these intentions:\n" +
               "1. INSULT: Attacking, belittling, or demeaning a specific person or group\n" +
               "2. PROFANITY: Vulgar/sexual language directed AT someone\n" +
               "3. HATE SPEECH: Attacks on race, ethnicity, religion, or identity\n" +
               "4. THREAT: Wishing harm, death, or violence toward someone\n\n" +
               "=== HOW TO DETECT OBFUSCATED TEXT ===\n" +
               "You MUST decode these patterns before deciding:\n" +
               "- Leetspeak (numbers as letters): 4=A, 3=E, 1=I, 0=O, 5=S, 7=T, 8=B, 9=G, 2=Z\n" +
               "- Shortened words: gblk=goblok, kntl=kontol, bgsat=bangsat, jncuk=jancuk\n" +
               "- Repeated letters: goblokkk = goblok, anjinggg = anjing\n" +
               "- Missing vowels: gblk, kntl, bgsat, jncuk (still detected as profanity)\n" +
               "- Mixed case: GoBloK = goblok, AnJiNg = anjing\n\n" +
               "=== HOW TO DETECT MULTILINGUAL CONTENT ===\n" +
               "You understand ALL languages. Apply the same logic regardless of language:\n" +
               "- English: fuck, shit, bitch, nigger, asshole, bastard, damn, cunt, you're stupid\n" +
               "- Indonesian: goblok, kontol, memek, ngentot, bangsat, anjing, asu, babi, tai, kampret\n" +
               "- Makassar: laso, pukimak, bangkoro, tae\n" +
               "- Javanese: jancuk, cok, ndasmu\n" +
               "- Betawi: anjing, babi, tai, goblok, kontol\n" +
               "- Any other language: detect using intent, not vocabulary\n\n" +
               "=== HOW TO DETECT SENTENCE-LEVEL TOXICITY ===\n" +
               "Do NOT focus on single words. Analyze the ENTIRE sentence:\n" +
               "- Look for a TARGET (someone being talked about: you/he/she/they/mantan/dia/lu/name)\n" +
               "- Look for a NEGATIVE JUDGMENT (any word/phrase expressing negativity toward the target)\n" +
               "- If BOTH exist → UNSAFE, regardless of specific words used\n\n" +
               "=== EXAMPLES OF PATTERNS (apply logic, don't memorize exact words) ===\n" +
               "- 'mantan saya anjing' = target=mantan, judgment=anjing → UNSAFE\n" +
               "- 'lu goblok' = target=lu, judgment=goblok → UNSAFE\n" +
               "- '4jg banget lo' = decoded='anjing banget lo', target=lo → UNSAFE\n" +
               "- 'gblk kntl' = decoded='goblok kontol' → UNSAFE (profanity)\n" +
               "- 'laso makassar' = target implied, judgment=laso → UNSAFE\n" +
               "- 'black ass nigger' = hate speech → UNSAFE\n" +
               "- 'Hari ini aku belajar coding' = no target, no negative judgment → SAFE\n\n" +
               "=== FINAL INSTRUCTION ===\n" +
               "Text to analyze: \"" + text + "\"\n\n" +
               "Reply ONLY with ONE WORD: SAFE or UNSAFE. NOTHING ELSE.\n" +
               "If ANY doubt, mark UNSAFE. Better to block than miss harmful content.";
    }
    
    @SuppressWarnings("unchecked")
    private String parseResponse(Map<String, Object> response) {
        try {
            if (response == null || !response.containsKey("choices")) return "SAFE";
            
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices.isEmpty()) return "SAFE";
            
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            if (content == null) return "SAFE";
            
            String result = content.trim().toUpperCase();
            if (result.contains("UNSAFE")) return "UNSAFE";
            return "SAFE";
            
        } catch (Exception e) {
            return "SAFE";
        }
    }
}