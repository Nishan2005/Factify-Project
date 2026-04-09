using FactifyApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Reflection.Emit;
using System.Text.Json;

namespace FactifyApi.Data
{
    public class AuthDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public AuthDbContext(DbContextOptions options) : base(options)
        { }
        public DbSet<Prediction> Predictions { get; set; }
        public DbSet<TopEvidence> TopEvidences { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }

        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Prediction>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Language)
                    .HasMaxLength(20);

                entity.Property(p => p.PatternLabel)
                    .HasMaxLength(50);

                entity.Property(p => p.Verdict)
                    .HasMaxLength(50);

                entity.HasMany(p => p.TopEvidences)
                    .WithOne(e => e.Prediction)
                    .HasForeignKey(e => e.PredictionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<TopEvidence>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Source)
                    .HasMaxLength(200);

                entity.Property(e => e.Title)
                    .HasMaxLength(500);
            });

            // In OnModelCreating:
            builder.Entity<Feedback>()
        .Property(f => f.Tags)
        .HasConversion(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
        );
        }
    }
}
