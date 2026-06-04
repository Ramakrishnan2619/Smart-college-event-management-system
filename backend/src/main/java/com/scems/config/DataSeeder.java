package com.scems.config;

import com.scems.model.Category;
import com.scems.model.Event;
import com.scems.model.Registration;
import com.scems.model.User;
import com.scems.repository.CategoryRepository;
import com.scems.repository.EventRepository;
import com.scems.repository.RegistrationRepository;
import com.scems.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final EventRepository eventRepo;
    private final RegistrationRepository regRepo;
    private final UserRepository userRepo;

    public DataSeeder(CategoryRepository categoryRepo, EventRepository eventRepo, RegistrationRepository regRepo, UserRepository userRepo) {
        this.categoryRepo = categoryRepo;
        this.eventRepo = eventRepo;
        this.regRepo = regRepo;
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategories();
        seedEvents();
        seedRegistrations();
        System.out.println("=== SCEMS Data Seeded: " + categoryRepo.count() + " categories, " + eventRepo.count() + " events, " + regRepo.count() + " registrations, " + userRepo.count() + " users ===");
    }

    private void seedUsers() {
        if (userRepo.count() > 0) return;

        User admin = new User();
        admin.setId("A001");
        admin.setRole("admin");
        admin.setName("Rama");
        admin.setUsername("Rama");
        admin.setPassword("vtu24465");
        admin.setDepartment("Administration");
        admin.setEmail("rama@college.edu");
        userRepo.save(admin);

        User student = new User();
        student.setId("S001");
        student.setRole("student");
        student.setName("Arjun Kumar");
        student.setRollNo("21CS045");
        student.setPassword("student123");
        student.setDepartment("CSE");
        student.setYear(3);
        student.setEmail("arjun@college.edu");
        userRepo.save(student);
    }

    private void seedCategories() {
        String[][] cats = {
            {"technical","Technical","💻","https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGhkMHN0NTBqa2ZpMDg5OGd6bmprNno0OHBxZDk4MXZqaHZqeWU2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MC6eSuC3yypCU/giphy.gif","6","Code. Build. Innovate.","🔥","when the code finally compiles ✅"},
            {"dance","Dance","💃","https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXZpcmZ6dHE0azZtcmk0Z3lvOGtzNzB6MHBmcm9kb2t3d2Z3ZnR1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xdBCeanNvjJZsSpAIR/giphy.gif","3","Move to the rhythm.","✨","main character energy activated 💃"},
            {"music","Music","🎵","https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDQ5NTFseWU5eGd0cTk1NmVpeTU0MnI3cTR0MWJ3d3RxYzYwb242OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H566QcRTJTjVzDaZIx/giphy.gif","4","Feel every beat.","🎶","mic drop incoming 🎤"},
            {"sports","Sports","🏏","https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3E3YXpydTlhanB0bDMzN2ZmdHkzYWp3ZDVnazU2NGJkanR2bWNhZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cfHRhBtgG5nWYGMO5j/giphy.gif","5","Play hard. Win harder.","🏆","bro thought he was Dhoni 🏏"},
            {"hackathon","Hackathon","🚀","https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmQ2cTB6OHdnMjdyMHRyOGFrcGRudjhvNXI3Z2k5ZnN3cmFjeGljaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13HgwGsXF0aiGY/giphy.gif","3","48 hours. One mission.","⚡","3am and we're still shipping 🚀"},
            {"quiz","Quiz","🧠","https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnRzdGUxZDBjZDd1b2UwZHZsbGd1NGphNTBjaHF1NHRqb3RieHU3ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26gR0YFZxWbnUPtMA/giphy.gif","2","Test your knowledge.","💡","galaxy brain moment loading... 🧠"},
            {"drama","Drama","🎭","https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dGEyMnl5YWpyNjU3MXdjd2J5MjYzd29wcGdzNHg5bTRlbmZ0c21vZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KgGU8KcXc2HLZtVlyd/giphy.gif","2","Stage is set. Lights on.","🌟","oscar-worthy performance incoming 🎭"},
            {"photography","Photography","📸","https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemxwcWdsdjFvYjJjYXh1bDdkMWh0MmNta256amM3bXE5ajl5Z242ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ma0X1M9lQB4FruMaX3/giphy.gif","2","Capture the moment.","📷","photographer spotted their prey 📸"},
            {"workshops","Workshops","🛠️","https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnF6dnRvYmRkZzRieHBiOWtlcjM5NW5pY3dhcWRjamRpN3BwNzhyciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif","4","Hands-on. Minds-on.","⚙️","turning caffeine into skills ☕"},
            {"cultural","Cultural","🎨","https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWxzdGc5aTZod29qbzBtZGt3aHozMnM2ZDBucXF4YTVwaHE1ZWM4eSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/amskMeldaPSiA/giphy.gif","3","Celebrate diversity.","🪷","vibe check: passed ✨"},
            {"competitions","Competitions","🏅","https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTU4ZjZ6Z2lhMWNjOHkxczluZGVxbWUxdDBqenpsN243cm9yOWExaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/88V19j2kRgfcxA9lp6/giphy.gif","3","Compete. Conquer. Celebrate.","🥇","trophy hunters assembled 🏆"},
            {"seminars","Seminars","🎓","https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG5mNW4xaXVyOW91eHJtcnBuNGg4eTJ5dWlnendpZjRjMGpmeW9xciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DdKE5ufpei55SWLaBX/giphy.gif","2","Learn from experts.","📚","pretending to take notes 📝"},
            {"esports","E-Sports","🎮","https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXB5ZmtuaHBrcGlrZ21xM2V4cmRnendwMGw3aDUyanlycXpyeXI3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0iempLLYnKHorZTXuV/giphy.gif","2","Game on, campus!","🕹️","lag killed me, not you 🎮"},
            {"literature","Literature","📖","https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGhzOGVrcmdjcjg0dHA3bWdveXkyMHpqcjV3ZGd0dDFyMmRmb3U1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WoWm8YzFQJg5i/giphy.gif","1","Words that move.","✍️","poetry slams harder than exams 📖"},
            {"social","Social Impact","🌍","https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTY2MGYza3J2Z2F3ZWd3Y2NxN21hdGFpcmU4dWlqMnQ3OWR5a3R0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMHxhOfscxPfIfm/giphy.gif","1","Make a difference.","💚","saving the world, one event at a time 🌍"},
            {"startup","Startup & Biz","💼","https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHBhb3JhczBtYnNxZmxhOXRuaGh4dXF5aTJqZjRjeDlzMTR5NTU5MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/67ThRZlYBvibtdF9JH/giphy.gif","1","Pitch. Pivot. Profit.","💰","shark tank vibes activated 💼"},
        };
        for (String[] c : cats) {
            Category cat = categoryRepo.findById(c[0]).orElse(new Category());
            cat.setId(c[0]); 
            cat.setName(c[1]); 
            cat.setEmoji(c[2]); 
            cat.setGifUrl(c[3]);
            cat.setEventCount(Integer.parseInt(c[4])); 
            cat.setTagline(c[5]);
            cat.setReactionBadge(c[6]); 
            cat.setMemeCaption(c[7]);
            categoryRepo.save(cat);
        }
    }

    private Event makeEvent(String eid, String title, String catId, String dept, String date, String time, String venue, String duration, int maxSeats, int regCount, String desc, String organizer, String color, boolean trending, String tags, String schedule, String faqs) {
        Event e = new Event();
        e.setEventId(eid); e.setTitle(title); e.setCategoryId(catId); e.setDepartment(dept);
        e.setDate(date); e.setTime(time); e.setVenue(venue); e.setDuration(duration);
        e.setMaxSeats(maxSeats); e.setRegisteredCount(regCount); e.setDescription(desc);
        e.setOrganizer(organizer); e.setOrganizerAvatar(""); e.setBannerColor(color);
        e.setIsTrending(trending); e.setTags(tags); e.setSchedule(schedule); e.setFaqs(faqs);
        return e;
    }

    private void seedEvents() {
        eventRepo.save(makeEvent("evt-001","CyberStorm 2026","technical","CSE","2026-05-10","09:00 AM","Main Auditorium, Block A","6 hours",200,156,
            "CodeStorm is the flagship competitive programming contest. Participants tackle algorithmic challenges over 6 intense hours. Cash prizes worth ₹50,000 for top 3 teams.",
            "Prof. Rajesh Iyer","#6366F1",true,"coding,competitive,algorithms",
            "[{\"time\":\"09:00 AM\",\"activity\":\"Registration & Kit Distribution\"},{\"time\":\"09:30 AM\",\"activity\":\"Opening Ceremony\"},{\"time\":\"10:00 AM\",\"activity\":\"Round 1 — Online Coding (2 hrs)\"},{\"time\":\"12:00 PM\",\"activity\":\"Lunch Break\"},{\"time\":\"01:00 PM\",\"activity\":\"Round 2 — Advanced DSA (2 hrs)\"},{\"time\":\"03:00 PM\",\"activity\":\"Results & Prize Distribution\"}]",
            "[{\"q\":\"Can I participate individually?\",\"a\":\"Yes, solo or teams of up to 3.\"},{\"q\":\"Which languages?\",\"a\":\"C, C++, Java, Python.\"},{\"q\":\"Bring laptop?\",\"a\":\"Yes, Wi-Fi provided.\"}]"));

        eventRepo.save(makeEvent("evt-002","Nritya - Annual Dance Fest","dance","Cultural Committee","2026-05-15","05:00 PM","Open Air Theatre","4 hours",500,412,
            "Nritya is the annual inter-college dance competition featuring solo, duo, and group performances across classical, contemporary, hip-hop, and folk genres.",
            "Meera Nair","#EC4899",true,"dance,performance,cultural",
            "[{\"time\":\"05:00 PM\",\"activity\":\"Gates Open\"},{\"time\":\"05:30 PM\",\"activity\":\"Solo Performances\"},{\"time\":\"06:30 PM\",\"activity\":\"Duo Performances\"},{\"time\":\"07:30 PM\",\"activity\":\"Group Performances\"},{\"time\":\"08:30 PM\",\"activity\":\"Awards\"}]",
            "[{\"q\":\"Registration fee?\",\"a\":\"Free for all college students.\"},{\"q\":\"Outside students?\",\"a\":\"Yes, inter-college event.\"}]"));

        eventRepo.save(makeEvent("evt-003","HackVerse 3.0 - 48hr Hackathon","hackathon","CSE","2026-05-20","10:00 AM","Innovation Lab, Block C","48 hours",150,142,
            "HackVerse is a 48-hour national-level hackathon. Themes: HealthTech, EdTech, FinTech, Sustainability. Mentors from Google, Microsoft.",
            "Dr. Anand Verma","#10B981",true,"hackathon,innovation,48hours",
            "[{\"time\":\"10:00 AM Day 1\",\"activity\":\"Inauguration\"},{\"time\":\"11:00 AM Day 1\",\"activity\":\"Hacking Begins\"},{\"time\":\"10:00 AM Day 3\",\"activity\":\"Final Submissions\"},{\"time\":\"02:00 PM Day 3\",\"activity\":\"Demo & Judging\"}]",
            "[{\"q\":\"Food provided?\",\"a\":\"Yes, all 48 hours.\"},{\"q\":\"First-years?\",\"a\":\"All years welcome.\"}]"));

        eventRepo.save(makeEvent("evt-004","Melody Night - Campus Unplugged","music","Music Club","2026-05-12","06:00 PM","Amphitheatre","3 hours",300,245,
            "An evening of soulful acoustic performances by student bands and solo artists. Open mic slots available.",
            "Kavya Sharma","#8B5CF6",false,"music,live,acoustic",
            "[{\"time\":\"06:00 PM\",\"activity\":\"Welcome\"},{\"time\":\"06:30 PM\",\"activity\":\"Solo Acoustic Set\"},{\"time\":\"07:30 PM\",\"activity\":\"Band Performances\"},{\"time\":\"08:30 PM\",\"activity\":\"Open Mic\"}]",
            "[{\"q\":\"Bring instrument?\",\"a\":\"Yes, inform us during registration.\"}]"));

        eventRepo.save(makeEvent("evt-005","IPL Screening + Cricket Tournament","sports","Sports Committee","2026-05-18","03:00 PM","Sports Ground + Common Room","5 hours",250,198,
            "Watch the IPL playoff match on the big screen, followed by inter-department T10 cricket tournament.",
            "Vikram Singh","#F59E0B",true,"cricket,ipl,tournament",
            "[{\"time\":\"03:00 PM\",\"activity\":\"Setup\"},{\"time\":\"03:30 PM\",\"activity\":\"Match Screening\"},{\"time\":\"06:00 PM\",\"activity\":\"T10 Semi Finals\"},{\"time\":\"07:30 PM\",\"activity\":\"Final + Awards\"}]",
            "[{\"q\":\"Need a team?\",\"a\":\"For tournament yes (6 members). Screening open to all.\"}]"));

        eventRepo.save(makeEvent("evt-006","BrainBrawl — Inter-Department Quiz","quiz","Literary Club","2026-05-22","02:00 PM","Seminar Hall 2, Block B","3 hours",120,78,
            "Multi-round quiz: GK, Science & Tech, Sports, Entertainment, Current Affairs. ₹15,000 prize pool.",
            "Dr. Sunita Reddy","#06B6D4",false,"quiz,knowledge,teams",
            "[{\"time\":\"02:00 PM\",\"activity\":\"Prelims\"},{\"time\":\"03:00 PM\",\"activity\":\"Quarter Finals\"},{\"time\":\"04:00 PM\",\"activity\":\"Semi Finals\"},{\"time\":\"04:45 PM\",\"activity\":\"Grand Final\"}]",
            "[{\"q\":\"Prelims?\",\"a\":\"Yes, top 8 teams advance.\"}]"));

        eventRepo.save(makeEvent("evt-007","Rangmanch — One Act Play","drama","Dramatics Society","2026-05-25","04:00 PM","College Auditorium","3 hours",350,210,
            "Rangmanch showcases theatrical brilliance through one-act plays. Professional theatre artists serve as judges.",
            "Aarti Mehta","#EF4444",false,"drama,theatre,acting",
            "[{\"time\":\"04:00 PM\",\"activity\":\"Opening\"},{\"time\":\"04:30 PM\",\"activity\":\"Block 1\"},{\"time\":\"06:00 PM\",\"activity\":\"Block 2\"},{\"time\":\"07:00 PM\",\"activity\":\"Awards\"}]",
            "[{\"q\":\"Time limit?\",\"a\":\"15-20 minutes per play.\"}]"));

        eventRepo.save(makeEvent("evt-008","ShutterStory - Photography Walk","photography","Photography Club","2026-06-01","06:00 AM","Meet: College Main Gate","4 hours",40,35,
            "Early morning photography walk through heritage parts of the city. Guided by award-winning photographer.",
            "Priya Kapoor","#D946EF",false,"photography,walk,heritage",
            "[{\"time\":\"06:00 AM\",\"activity\":\"Briefing\"},{\"time\":\"06:30 AM\",\"activity\":\"Walk Begins\"},{\"time\":\"08:30 AM\",\"activity\":\"Breakfast & Review\"},{\"time\":\"09:30 AM\",\"activity\":\"Best Shot Selection\"}]",
            "[{\"q\":\"Phone camera?\",\"a\":\"Yes, separate category.\"}]"));

        eventRepo.save(makeEvent("evt-009","Full-Stack Bootcamp (React + Spring Boot)","workshops","CSE","2026-05-28","10:00 AM","Lab 301, Block D","8 hours",60,58,
            "Hands-on workshop covering React frontend and Spring Boot backend. Build a complete project. Certificates provided.",
            "Prof. Deepak Gupta","#0EA5E9",true,"workshop,fullstack,react,springboot",
            "[{\"time\":\"10:00 AM\",\"activity\":\"Setup\"},{\"time\":\"10:30 AM\",\"activity\":\"React + Tailwind\"},{\"time\":\"01:30 PM\",\"activity\":\"Spring Boot REST API\"},{\"time\":\"03:30 PM\",\"activity\":\"Integration\"},{\"time\":\"05:00 PM\",\"activity\":\"Certificates\"}]",
            "[{\"q\":\"Prior experience?\",\"a\":\"Basic Java and JS recommended.\"},{\"q\":\"Laptops?\",\"a\":\"Bring your own.\"}]"));

        eventRepo.save(makeEvent("evt-010","Rangotsav - Cultural Night","cultural","Cultural Committee","2026-05-30","05:00 PM","Open Air Theatre","5 hours",600,520,
            "Grand cultural night celebrating India's diversity through dance, music, fashion, and art.",
            "Dr. Priya Sharma","#F97316",true,"cultural,diversity,performances",
            "[{\"time\":\"05:00 PM\",\"activity\":\"Inauguration\"},{\"time\":\"05:30 PM\",\"activity\":\"Classical Dance\"},{\"time\":\"06:30 PM\",\"activity\":\"Music Showcase\"},{\"time\":\"07:30 PM\",\"activity\":\"Fashion Walk\"},{\"time\":\"08:30 PM\",\"activity\":\"DJ Night\"}]",
            "[{\"q\":\"Dress code?\",\"a\":\"Traditional wear encouraged.\"}]"));

        eventRepo.save(makeEvent("evt-011","RoboWars 4.0","competitions","Mech","2026-06-05","10:00 AM","Mech Workshop, Block E","7 hours",80,72,
            "Build combat robots and battle. Categories: Lightweight (<15kg) and Heavyweight (<30kg). ₹40,000 prizes.",
            "Prof. Arun Patel","#DC2626",false,"robotics,competition,mechanical",
            "[{\"time\":\"10:00 AM\",\"activity\":\"Bot Inspection\"},{\"time\":\"11:00 AM\",\"activity\":\"Lightweight Bouts\"},{\"time\":\"02:00 PM\",\"activity\":\"Heavyweight Bouts\"},{\"time\":\"04:00 PM\",\"activity\":\"Grand Final\"}]",
            "[{\"q\":\"Budget limit?\",\"a\":\"No, but meet weight/safety specs.\"}]"));

        eventRepo.save(makeEvent("evt-012","AI/ML in Healthcare — Expert Talk","seminars","CSE","2026-06-08","11:00 AM","Seminar Hall 1, Block A","2 hours",150,95,
            "Industry seminar: Dr. Shalini Gupta (Google Health) on AI/ML in healthcare diagnostics.",
            "Dr. Ramesh Kumar","#14B8A6",false,"seminar,AI,healthcare",
            "[{\"time\":\"11:00 AM\",\"activity\":\"Welcome\"},{\"time\":\"11:15 AM\",\"activity\":\"Keynote\"},{\"time\":\"12:00 PM\",\"activity\":\"Q&A\"},{\"time\":\"12:30 PM\",\"activity\":\"Networking\"}]",
            "[{\"q\":\"Certificates?\",\"a\":\"Yes, e-certificates emailed.\"}]"));

        eventRepo.save(makeEvent("evt-013","Valorant Campus Championship","esports","Gaming Club","2026-06-10","12:00 PM","Computer Lab 4, Block D","6 hours",100,88,
            "Ultimate Valorant tournament. 5v5 team format, BO3 bracket. Prize pool: ₹20,000.",
            "Rohit Joshi","#EF4444",true,"esports,valorant,gaming",
            "[{\"time\":\"12:00 PM\",\"activity\":\"Check-in\"},{\"time\":\"12:30 PM\",\"activity\":\"Group Stage\"},{\"time\":\"03:00 PM\",\"activity\":\"Quarter Finals\"},{\"time\":\"04:30 PM\",\"activity\":\"Semi & Final\"}]",
            "[{\"q\":\"Own peripherals?\",\"a\":\"Yes, bring mouse/keyboard. PCs provided.\"}]"));

        eventRepo.save(makeEvent("evt-014","Cloud Computing with AWS — Workshop","workshops","IT","2026-06-12","09:30 AM","Lab 201, Block D","6 hours",50,47,
            "AWS fundamentals — EC2, S3, Lambda, RDS. Deploy a serverless app. AWS credits provided.",
            "Prof. Neeraj Rao","#F59E0B",false,"workshop,aws,cloud",
            "[{\"time\":\"09:30 AM\",\"activity\":\"AWS Account Setup\"},{\"time\":\"10:30 AM\",\"activity\":\"EC2 & S3\"},{\"time\":\"01:00 PM\",\"activity\":\"Lambda & API Gateway\"},{\"time\":\"03:00 PM\",\"activity\":\"Project Deployment\"}]",
            "[{\"q\":\"Free credits?\",\"a\":\"Yes, $50 AWS credits for 3 months.\"}]"));

        eventRepo.save(makeEvent("evt-015","Street Dance Battle — B-Boy Edition","dance","Dance Club","2026-06-14","04:00 PM","Canteen Courtyard","3 hours",200,145,
            "Raw street dance battle format. 1v1 B-Boy/B-Girl battles. DJ spinning live beats.",
            "Ravi Kumar","#A855F7",false,"dance,bboy,street",
            "[{\"time\":\"04:00 PM\",\"activity\":\"Cyphers\"},{\"time\":\"04:30 PM\",\"activity\":\"Top 16\"},{\"time\":\"05:30 PM\",\"activity\":\"Semi Finals\"},{\"time\":\"06:30 PM\",\"activity\":\"Final Battle\"}]",
            "[{\"q\":\"Register to battle?\",\"a\":\"Yes, walk-ins accepted.\"}]"));

        eventRepo.save(makeEvent("evt-016","Battle of Bands","music","Music Club","2026-06-16","06:00 PM","Open Air Theatre","4 hours",400,310,
            "Campus bands go head-to-head. Genres: rock, indie, Bollywood fusion. Professional sound system.",
            "Amrita Das","#7C3AED",true,"music,bands,live",
            "[{\"time\":\"06:00 PM\",\"activity\":\"Sound Check\"},{\"time\":\"06:30 PM\",\"activity\":\"Band 1 & 2\"},{\"time\":\"07:30 PM\",\"activity\":\"Band 3 & 4\"},{\"time\":\"09:30 PM\",\"activity\":\"Results\"}]",
            "[{\"q\":\"Members per band?\",\"a\":\"3-7 members.\"}]"));

        eventRepo.save(makeEvent("evt-017","Inter-Department Football League","sports","Sports Committee","2026-06-18","04:00 PM","College Football Ground","4 hours",300,180,
            "Seven-a-side football tournament. Group stage + knockout rounds. Professional referees.",
            "Coach Sunil Yadav","#22C55E",false,"football,sports,tournament",
            "[{\"time\":\"04:00 PM\",\"activity\":\"Team Assembly\"},{\"time\":\"04:30 PM\",\"activity\":\"Group A\"},{\"time\":\"05:30 PM\",\"activity\":\"Group B\"},{\"time\":\"06:30 PM\",\"activity\":\"Semi Finals\"},{\"time\":\"07:30 PM\",\"activity\":\"Final\"}]",
            "[{\"q\":\"Football boots?\",\"a\":\"Recommended. Rubber studs.\"}]"));

        eventRepo.save(makeEvent("evt-018","Cyber Security CTF Challenge","technical","IT","2026-06-20","10:00 AM","Lab 401, Block D","5 hours",80,65,
            "Capture The Flag — cryptography, web exploitation, reverse engineering, forensics. Beginner-friendly.",
            "Prof. Kiran Bhat","#059669",false,"cybersecurity,ctf,hacking",
            "[{\"time\":\"10:00 AM\",\"activity\":\"Briefing\"},{\"time\":\"10:30 AM\",\"activity\":\"CTF Begins\"},{\"time\":\"01:00 PM\",\"activity\":\"Hints Released\"},{\"time\":\"03:00 PM\",\"activity\":\"CTF Ends\"},{\"time\":\"03:30 PM\",\"activity\":\"Walkthroughs & Awards\"}]",
            "[{\"q\":\"Hacking experience?\",\"a\":\"No, beginner challenges included.\"}]"));

        eventRepo.save(makeEvent("evt-019","UI/UX Design Sprint","workshops","CSE","2026-06-22","10:00 AM","Design Lab, Block C","6 hours",40,38,
            "Design thinking workshop. User research to Figma prototypes in one day. Industry designers.",
            "Sneha Patel","#E11D48",false,"design,figma,uiux",
            "[{\"time\":\"10:00 AM\",\"activity\":\"Design Thinking\"},{\"time\":\"11:00 AM\",\"activity\":\"User Research\"},{\"time\":\"01:30 PM\",\"activity\":\"Wireframing\"},{\"time\":\"03:30 PM\",\"activity\":\"Hi-Fi Prototyping\"}]",
            "[{\"q\":\"Figma free?\",\"a\":\"Yes, free tier available.\"}]"));

        eventRepo.save(makeEvent("evt-020","Startup Pitch Day","startup","Entrepreneurship Cell","2026-06-25","11:00 AM","Conference Hall, Admin Block","4 hours",100,62,
            "Pitch your startup idea. Top 3 get ₹1,00,000 seed funding. Mentorship for all shortlisted teams.",
            "Dr. Vivek Jain","#0891B2",false,"startup,pitch,entrepreneurship",
            "[{\"time\":\"11:00 AM\",\"activity\":\"Welcome\"},{\"time\":\"11:30 AM\",\"activity\":\"Pitch Session 1\"},{\"time\":\"02:00 PM\",\"activity\":\"Pitch Session 2\"},{\"time\":\"03:30 PM\",\"activity\":\"Results\"}]",
            "[{\"q\":\"Working prototype?\",\"a\":\"Not mandatory. Pitch deck sufficient.\"}]"));

        eventRepo.save(makeEvent("evt-021","Poetry Slam Night","literature","Literary Club","2026-06-28","06:00 PM","Library Lawn","2 hours",80,42,
            "Open-mic poetry slam in Hindi, English, Urdu. Judged by audience applause.",
            "Fatima Khan","#6D28D9",false,"poetry,literature,openmic",
            "[{\"time\":\"06:00 PM\",\"activity\":\"Registration\"},{\"time\":\"06:30 PM\",\"activity\":\"Round 1\"},{\"time\":\"07:30 PM\",\"activity\":\"Round 2 & Finals\"},{\"time\":\"08:00 PM\",\"activity\":\"Winner & Tea\"}]",
            "[{\"q\":\"Any language?\",\"a\":\"Hindi, English, Urdu, regional languages.\"}]"));

        eventRepo.save(makeEvent("evt-022","Badminton Championship","sports","Sports Committee","2026-07-01","08:00 AM","Indoor Sports Complex","8 hours",120,90,
            "Inter-department badminton: Men's Singles, Women's Singles, Mixed Doubles. Medals and certificates.",
            "Coach Prerna Gill","#2563EB",false,"badminton,sports,championship",
            "[{\"time\":\"08:00 AM\",\"activity\":\"Warm-up & Draw\"},{\"time\":\"09:00 AM\",\"activity\":\"Preliminary Rounds\"},{\"time\":\"01:00 PM\",\"activity\":\"Quarter & Semi Finals\"},{\"time\":\"03:00 PM\",\"activity\":\"Finals & Awards\"}]",
            "[{\"q\":\"Own racquet?\",\"a\":\"Yes, limited available for borrowing.\"}]"));

        eventRepo.save(makeEvent("evt-023","IoT & Embedded Systems Workshop","workshops","ECE","2026-07-03","10:00 AM","ECE Lab 2, Block B","6 hours",45,40,
            "Build IoT projects with Arduino and ESP32. Sensor interfacing, MQTT, cloud dashboards. Starter kit included.",
            "Prof. Lakshmi Narayanan","#0D9488",false,"iot,arduino,embedded",
            "[{\"time\":\"10:00 AM\",\"activity\":\"Arduino Basics\"},{\"time\":\"11:30 AM\",\"activity\":\"Sensor Interfacing\"},{\"time\":\"01:30 PM\",\"activity\":\"ESP32 + WiFi\"},{\"time\":\"03:30 PM\",\"activity\":\"Cloud Dashboard\"}]",
            "[{\"q\":\"Mechanical students?\",\"a\":\"Anyone interested in IoT.\"}]"));

        eventRepo.save(makeEvent("evt-024","Campus Clean-Up Drive","social","NSS Unit","2026-07-05","07:00 AM","College Campus (All Zones)","3 hours",200,130,
            "Campus-wide clean-up and plantation drive. Earn NSS activity hours. Refreshments and certificates.",
            "Dr. Ajay Mohan","#16A34A",false,"social,nss,environment",
            "[{\"time\":\"07:00 AM\",\"activity\":\"Assembly\"},{\"time\":\"07:30 AM\",\"activity\":\"Clean-Up Begins\"},{\"time\":\"09:00 AM\",\"activity\":\"Plantation\"},{\"time\":\"09:30 AM\",\"activity\":\"Refreshments\"}]",
            "[{\"q\":\"NSS hours?\",\"a\":\"Yes, 3 activity hours.\"}]"));

        eventRepo.save(makeEvent("evt-street-dance","Street Dance Battle","dance","Cultural Committee","2026-05-28","06:00 PM","College Quadrangle","3 hours",300,180,
            "A high-energy underground-style street dance battle. Show off your breakdancing, popping, and locking skills.",
            "Rahul Verma","#F59E0B",true,"dance,street,battle",
            "[{\"time\":\"06:00 PM\",\"activity\":\"Warm-up\"},{\"time\":\"06:30 PM\",\"activity\":\"Battles Begin\"},{\"time\":\"08:00 PM\",\"activity\":\"Finals\"}]",
            "[{\"q\":\"All levels?\",\"a\":\"Yes, anyone can join!\"}]"));
    }

    private void seedRegistrations() {
        String[][] regs = {
            {"reg-001","evt-001","S001","upcoming","2026-04-20"},
            {"reg-002","evt-009","S001","upcoming","2026-04-18"},
            {"reg-003","evt-004","S001","completed","2026-03-15"},
            {"reg-004","evt-006","S001","completed","2026-03-10"},
            {"reg-005","evt-005","S001","completed","2026-03-01"},
            {"reg-006","evt-010","S001","upcoming","2026-04-19"},
            {"reg-007","evt-003","S001","cancelled","2026-04-05"},
            {"reg-008","evt-014","S001","upcoming","2026-04-21"},
        };
        for (String[] r : regs) {
            Registration reg = new Registration();
            reg.setRegistrationId(r[0]); reg.setEventId(r[1]); reg.setStudentId(r[2]);
            reg.setStatus(r[3]); reg.setRegisteredOn(r[4]);
            // Add feedback for completed events
            if ("reg-003".equals(r[0])) { reg.setFeedbackRating(5); reg.setFeedbackComment("Amazing acoustic night! The bands were incredible."); }
            if ("reg-004".equals(r[0])) { reg.setFeedbackRating(4); reg.setFeedbackComment("Great questions, learned a lot. Wish it was longer."); }
            regRepo.save(reg);
        }
    }
}
