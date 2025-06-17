using System.Text.Json.Serialization;

namespace SummerPracticeWebApi.DTOs
{
    public class LLMRequestDTO
    {
        [JsonPropertyName("messages")]
        public required List<ChatMessageDTO> Messages { get; set; }

        [JsonPropertyName("stream")]
        public bool Stream { get; set; } = false;

        [JsonPropertyName("cache_prompt")]
        public bool CachePrompt { get; set; } = true;

        [JsonPropertyName("samplers")]
        public string Samplers { get; set; } = "edkypmxt";

        [JsonPropertyName("temperature")]
        public double Temperature { get; set; } = 0.2;

        [JsonPropertyName("dynatemp_range")]
        public int DynatempRange { get; set; } = 0;

        [JsonPropertyName("dynatemp_exponent")]
        public int DynatempExponent { get; set; } = 1;

        [JsonPropertyName("top_k")]
        public int TopK { get; set; } = 40;

        [JsonPropertyName("top_p")]
        public double TopP { get; set; } = 0.95;

        [JsonPropertyName("min_p")]
        public double MinP { get; set; } = 0.05;

        [JsonPropertyName("typical_p")]
        public double TypicalP { get; set; } = 1;

        [JsonPropertyName("xtc_probability")]
        public double XtcProbability { get; set; } = 0;

        [JsonPropertyName("xtc_threshold")]
        public double XtcThreshold { get; set; } = 0.1;

        [JsonPropertyName("repeat_last_n")]
        public int RepeatLastN { get; set; } = 64;

        [JsonPropertyName("repeat_penalty")]
        public double RepeatPenalty { get; set; } = 1.1;

        [JsonPropertyName("presence_penalty")]
        public double PresencePenalty { get; set; } = 0;

        [JsonPropertyName("frequency_penalty")]
        public double FrequencyPenalty { get; set; } = 0;

        [JsonPropertyName("dry_multiplier")]
        public double DryMultiplier { get; set; } = 0;

        [JsonPropertyName("dry_base")]
        public double DryBase { get; set; } = 1.75;

        [JsonPropertyName("dry_allowed_length")]
        public int DryAllowedLength { get; set; } = 2;

        [JsonPropertyName("dry_penalty_last_n")]
        public int DryPenaltyLastN { get; set; } = -1;

        [JsonPropertyName("max_new_tokens")]
        public int MaxNewTokens { get; set; } = 300;

        [JsonPropertyName("timings_per_token")]
        public bool TimingsPerToken { get; set; } = false;
    }

    public class ChatMessageDTO
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }

    }
}

