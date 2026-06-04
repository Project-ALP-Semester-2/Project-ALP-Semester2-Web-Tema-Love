package com.example.demo.Service;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BadwordsService {

    private Set<String> dictionarySet = new HashSet<>();
    private List<String> dict = new ArrayList<>();
    private final Map<Character, Character> substitutions = new HashMap<>();

    public BadwordsService() {
        substitutions.put('4', 'a'); substitutions.put('@', 'a');
        substitutions.put('8', 'b');
        substitutions.put('(', 'c');
        substitutions.put('3', 'e');
        substitutions.put('6', 'g'); substitutions.put('9', 'g');
        substitutions.put('1', 'i'); substitutions.put('!', 'i'); substitutions.put('|', 'i');
        substitutions.put('0', 'o');
        substitutions.put('5', 's'); substitutions.put('$', 's');
        substitutions.put('7', 't');
        substitutions.put('2', 'z');
    }

    @PostConstruct
    public void init() throws IOException {
        Resource resource = new ClassPathResource("dict.json");
        try (InputStream is = resource.getInputStream(); 
             Scanner scanner = new Scanner(is, "UTF-8")) {
            
            String isiJson = scanner.useDelimiter("\\A").next();
            
            isiJson = isiJson.replace("[", "").replace("]", "").replace("\"", "");
            String[] words = isiJson.split(",");
            
            for (String word : words) {
                if (!word.trim().isEmpty()) {
                    dictionarySet.add(word.trim().toLowerCase());
                }
            }
        }
        rebuildDictArray();
        System.out.println("LOG: Berhasil memuat " + dictionarySet.size() + " kata kotor tanpa Jackson!");
    }

    private void rebuildDictArray() {
        this.dict = new ArrayList<>(this.dictionarySet);
    }

    private String normalize(String text) {
        if (text == null) return "";
        StringBuilder sb = new StringBuilder();
        String lower = text.toLowerCase();
        
        for (char ch : lower.toCharArray()) {
            sb.append(substitutions.getOrDefault(ch, ch));
        }
        return sb.toString();
    }

    private void validateInput(String text) {
        if (text == null) throw new IllegalArgumentException("string expected");
        if (text.trim().isEmpty()) throw new IllegalArgumentException("empty string passed");
    }

    public String censor(String text, String replacement) {
        validateInput(text);
        if (dict.isEmpty()) return text;

        Pattern pattern = Pattern.compile("([^\\p{L}\\p{N}]+)", Pattern.UNICODE_CHARACTER_CLASS);
        Matcher matcher = pattern.matcher(text);

        List<String> parts = new ArrayList<>();
        int lastEnd = 0;
        while (matcher.find()) {
            parts.add(text.substring(lastEnd, matcher.start()));
            parts.add(matcher.group());
            lastEnd = matcher.end();
        }
        parts.add(text.substring(lastEnd));

        StringBuilder result = new StringBuilder();
        for (String part : parts) {
            String normalizedPart = normalize(part);
            if (dictionarySet.contains(normalizedPart)) {
                result.append(replacement);
            } else {
                result.append(part);
            }
        }

        return result.toString();
    }

    public String censor(String text) {
        return censor(text, "***");
    }
}