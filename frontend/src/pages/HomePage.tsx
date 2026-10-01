import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  BookOpen,
  Building2,
  Calendar,
  Check,
  Clock,
  Heart,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { SlidingInsuranceStrip } from '../components/SlidingInsuranceStrip';
import { useSettings } from '../context/SettingsContext';
import type { Facility, Specialty, Treatment, Doctor, Insight } from '../types';
import { api } from '../utils/api';

type CollectionStatus = 'loading' | 'ready' | 'error';
type Collection<Item> = { items: Item[]; status: CollectionStatus };
type HomeCollections = {
  specialties: Collection<Specialty>;
  treatments: Collection<Treatment>;
  doctors: Collection<Doctor>;
  facilities: Collection<Facility>;
  insights: Collection<Insight>;
};

const HOME_STYLES = `
  .sr-home {
    --sr-ink: #183f3d;
    --sr-muted: #596966;
    --sr-paper: #faf8f3;
    --sr-line: #e0e5dd;
    --sr-rose: #8f4160;
    --sr-sage: #e8eee5;
    color: var(--sr-ink);
    background: var(--sr-paper);
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    isolation: isolate;
  }
  .sr-home *, .sr-home *::before, .sr-home *::after { box-sizing: border-box; }
  .sr-home h1, .sr-home h2, .sr-home h3, .sr-home p { margin: 0; }
  .sr-home a { color: inherit; text-decoration: none; }
  .sr-home img { display: block; max-width: 100%; }
  .sr-home svg { flex-shrink: 0; }
  .sr-home a, .sr-home summary { -webkit-tap-highlight-color: transparent; }
  .sr-home :focus-visible { outline: 3px solid var(--sr-rose); outline-offset: 5px; }
  .sr-home ::selection { color: #183f3d; background: #dfe9cc; }
  .sr-home .sr-container { width: min(1200px, calc(100% - 80px)); margin-inline: auto; }
  .sr-home .sr-section { padding-block: 100px; }
  .sr-home .sr-kicker {
    display: inline-flex; align-items: center; gap: 10px;
    color: var(--sr-rose); font-size: 11px; font-weight: 700;
    letter-spacing: .18em; line-height: 1.5; text-transform: uppercase;
  }
  .sr-home .sr-kicker::before { content: ''; width: 22px; height: 1px; background: currentColor; }
  .sr-home .sr-display {
    color: var(--sr-ink); font-family: 'Iowan Old Style', 'Palatino Linotype', 'Newsreader', 'Book Antiqua', Georgia, serif;
    font-weight: 400; letter-spacing: -.045em; line-height: 1.08;
  }
  .sr-home .sr-display em { color: var(--sr-rose); font-weight: 400; font-style: normal; }
  .sr-home .sr-heading { font-size: clamp(34px, 4.2vw, 54px); }
  .sr-home .sr-copy { color: var(--sr-muted); font-size: 15px; line-height: 1.85; }
  .sr-home .sr-button {
    display: inline-flex; align-items: center; justify-content: center; gap: 12px;
    min-height: 52px; padding: 14px 23px; border: 1px solid var(--sr-ink); border-radius: 8px;
    background: var(--sr-ink); color: #fff; font-size: 13px; font-weight: 600;
    line-height: 1.4; transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
  }
  .sr-home .sr-button:hover { background: #285854; transform: translateY(-2px); box-shadow: 0 8px 20px #183f3d16; }
  .sr-home .sr-button--light { background: #f4f2e8; border-color: #f4f2e8; color: var(--sr-ink); }
  .sr-home .sr-button--light:hover { background: #fff; }
  .sr-home .sr-button--outline { background: transparent; border-color: #cbd4c9; color: var(--sr-ink); }
  .sr-home .sr-button--outline:hover { background: var(--sr-sage); }
  .sr-home .sr-text-link {
    display: inline-flex; align-items: center; gap: 10px; min-height: 44px;
    font-size: 13px; font-weight: 600; line-height: 1.4;
  }
  .sr-home .sr-text-link svg { transition: transform .2s ease; }
  .sr-home .sr-text-link:hover svg { transform: translateX(4px); }
  .sr-home .sr-text-link:hover { color: var(--sr-rose); }
  .sr-home .sr-heading-row {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 32px; margin-bottom: 36px;
  }
  .sr-home .sr-heading-row .sr-heading { margin-top: 14px; max-width: 670px; }
  .sr-home .sr-heading-row > .sr-text-link { flex-shrink: 0; }
  .sr-home .sr-grid { display: grid; gap: 22px; }
  .sr-home .sr-grid--four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .sr-home .sr-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sr-home .sr-grid--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sr-home .sr-media { position: relative; overflow: hidden; background: #e8ede5; }
  .sr-home .sr-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .65s ease; }
  .sr-home .sr-image-placeholder {
    display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; min-height: 180px;
    color: #54706a; background: radial-gradient(circle at 25% 20%, #f8eee7, transparent 60%), #e2ebe2;
  }
  .sr-home .sr-image-placeholder svg { width: 52px; height: 52px; stroke-width: 1; }
  .sr-home .sr-hero { position: relative; padding-top: 76px; padding-bottom: 68px; overflow: hidden; }
  .sr-home .sr-hero::before {
    content: ''; position: absolute; width: 620px; height: 620px; top: -150px; right: -300px;
    border: 1px solid #d9e0d3; border-radius: 50%; pointer-events: none;
  }
  .sr-home .sr-hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; gap: 80px; }
  .sr-home .sr-hero-title { margin-top: 24px; font-size: clamp(54px, 6.6vw, 86px); }
  .sr-home .sr-hero-title em { display: inline-block; font-style: normal; }
  .sr-home .sr-hero-copy { max-width: 430px; margin-top: 26px; font-size: 16px; }
  .sr-home .sr-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; margin-top: 30px; }
  .sr-home .sr-care-tags { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 34px; }
  .sr-home .sr-care-tags span {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 11px;
    border: 1px solid #dce1d7; border-radius: 50px; font-size: 11px; color: #4e6560;
  }
  .sr-home .sr-hero-art { position: relative; padding: 18px 18px 28px; }
  .sr-home .sr-hero-orbit {
    position: absolute; inset: 0 0 42px; border: 1px solid #cbd7c6;
    border-radius: 250px 250px 38px 38px; transform: rotate(5deg); pointer-events: none;
  }
  .sr-home .sr-hero-image { height: 530px; border-radius: 240px 240px 28px 28px; }
  .sr-home .sr-hero-image img { object-position: 54% center; }
  .sr-home .sr-hero-image::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, #153e3dd9); }
  .sr-home .sr-photo-caption { position: absolute; z-index: 1; bottom: 31px; left: 31px; right: 24px; color: #fff; }
  .sr-home .sr-photo-caption span { font-size: 10px; text-transform: uppercase; letter-spacing: .17em; opacity: .8; }
  .sr-home .sr-photo-caption p { margin-top: 6px; font-family: Georgia, serif; font-size: 28px; line-height: 1.2; }
  .sr-home .sr-hero-flower {
    position: absolute; z-index: 2; top: 14px; right: -8px; display: grid; place-items: center;
    width: 84px; height: 84px; border-radius: 50%; border: 7px solid var(--sr-paper); background: #e4ebd9; color: var(--sr-ink);
  }
  .sr-home .sr-hero-flower svg { width: 30px; height: 30px; stroke-width: 1.2; }
  .sr-home .sr-hero-note {
    position: absolute; z-index: 2; left: -36px; bottom: 6px; display: flex; align-items: center; gap: 13px;
    padding: 19px 24px; border: 1px solid #e7e7df; border-radius: 12px; background: #fffefb;
    box-shadow: 0 14px 40px #173c3a0c;
  }
  .sr-home .sr-note-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: #f4e7e9; color: var(--sr-rose); }
  .sr-home .sr-hero-note strong { display: block; font-size: 13px; font-weight: 600; }
  .sr-home .sr-hero-note small { display: block; margin-top: 3px; color: var(--sr-muted); font-size: 11px; }
  .sr-home .sr-quick-links {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid var(--sr-line); border-radius: 14px; background: #fffefb; overflow: hidden;
  }
  .sr-home .sr-quick-link { display: flex; align-items: center; gap: 16px; padding: 27px; min-height: 112px; transition: background .2s ease; }
  .sr-home .sr-quick-link + .sr-quick-link { border-left: 1px solid var(--sr-line); }
  .sr-home .sr-quick-link:hover { background: #f0f4eb; }
  .sr-home .sr-quick-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--sr-sage); flex-shrink: 0; }
  .sr-home .sr-quick-link strong { display: block; font-size: 14px; font-weight: 600; }
  .sr-home .sr-quick-link small { display: block; margin-top: 3px; color: var(--sr-muted); font-size: 12px; }
  .sr-home .sr-quick-link > svg { margin-left: auto; width: 18px; height: 18px; }
  .sr-home .sr-location { display: flex; justify-content: center; align-items: center; gap: 8px; padding-top: 18px; font-size: 11px; color: var(--sr-muted); text-align: center; }
  .sr-home .sr-card { display: flex; flex-direction: column; border: 1px solid var(--sr-line); border-radius: 12px; background: #fffefb; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease; }
  .sr-home .sr-card:hover { transform: translateY(-5px); box-shadow: 0 16px 34px #183f3d0b; }
  .sr-home .sr-card:hover .sr-media img { transform: scale(1.045); }
  .sr-home .sr-card .sr-media { height: 184px; }
  .sr-home .sr-card-body { display: flex; flex: 1; flex-direction: column; align-items: flex-start; padding: 24px; }
  .sr-home .sr-card h3 { font-size: 18px; font-weight: 500; line-height: 1.35; letter-spacing: -.025em; overflow-wrap: anywhere; }
  .sr-home .sr-card .sr-copy { margin-top: 12px; font-size: 13px; }
  .sr-home .sr-card-category { display: block; margin-bottom: 10px; color: var(--sr-rose); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .sr-home .sr-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; margin-top: auto; padding-top: 23px; font-size: 12px; font-weight: 600; }
  .sr-home .sr-card-footer svg { width: 17px; height: 17px; }
  .sr-home .sr-clamp { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
  .sr-home .sr-about { background: var(--sr-sage); }
  .sr-home .sr-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 84px; align-items: center; }
  .sr-home .sr-about-visual { position: relative; padding-right: 20px; padding-bottom: 30px; }
  .sr-home .sr-about-image { height: 470px; border-radius: 12px 110px 12px 12px; }
  .sr-home .sr-about-note { position: absolute; bottom: 0; right: 0; max-width: 260px; padding: 24px; border-radius: 12px; background: #fffefb; box-shadow: 0 8px 28px #183f3d0c; }
  .sr-home .sr-about-note .sr-display { margin-top: 10px; font-size: 29px; }
  .sr-home .sr-about-note p:last-child { margin-top: 10px; color: var(--sr-muted); font-size: 11px; }
  .sr-home .sr-about .sr-heading { margin-top: 18px; margin-bottom: 24px; }
  .sr-home .sr-about .sr-copy + .sr-copy { margin-top: 16px; }
  .sr-home .sr-about-features { display: grid; gap: 14px; margin-block: 27px; padding-block: 22px; border-block: 1px solid #cdd8c9; }
  .sr-home .sr-about-features > div { display: flex; align-items: center; gap: 12px; font-size: 13px; }
  .sr-home .sr-about-features svg { width: 18px; height: 18px; color: #547660; }
  .sr-home .sr-treatment { padding: 28px; }
  .sr-home .sr-treatment-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 24px; }
  .sr-home .sr-treatment-number { color: #8a9b90; font-family: Georgia, serif; font-size: 29px; }
  .sr-home .sr-treatment .sr-card-category { margin: 0; max-width: 75%; text-align: right; }
  .sr-home .sr-treatment h3 { font-size: 21px; }
  .sr-home .sr-treatment .sr-card-footer { margin-top: auto; padding-top: 24px; }
  .sr-home .sr-treatment-duration { margin-top: 20px; font-size: 11px; color: var(--sr-muted); }
  .sr-home .sr-doctors { background: #183f3d; color: #fff; }
  .sr-home .sr-doctors .sr-kicker { color: #d0ddc2; }
  .sr-home .sr-doctors .sr-heading, .sr-home .sr-doctors .sr-heading em { color: #f8f5ec; }
  .sr-home .sr-doctors .sr-heading em { color: #d0ddc2; }
  .sr-home .sr-doctors .sr-heading-row > .sr-text-link:hover { color: #d0ddc2; }
  .sr-home .sr-doctor-card { color: var(--sr-ink); border: 0; }
  .sr-home .sr-doctor-card .sr-media { height: 280px; }
  .sr-home .sr-doctor-card .sr-media img { object-position: center top; }
  .sr-home .sr-doctor-card .sr-card-body { padding: 22px; }
  .sr-home .sr-doctor-designation { color: var(--sr-rose); margin-top: 7px; font-size: 12px; }
  .sr-home .sr-doctor-card .sr-copy { font-size: 11px; margin-top: 6px; }
  .sr-home .sr-doctor-department { position: absolute; left: 12px; right: 12px; bottom: 12px; padding: 8px 12px; border-radius: 6px; background: #fffefbf2; font-size: 10px; color: var(--sr-ink); }
  .sr-home .sr-doctor-card .sr-card-footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--sr-line); font-size: 10px; }
  .sr-home .sr-journey { border-bottom: 1px solid var(--sr-line); }
  .sr-home .sr-journey-grid { display: grid; grid-template-columns: .95fr 1.55fr; gap: 70px; }
  .sr-home .sr-journey .sr-heading { margin-top: 18px; }
  .sr-home .sr-journey .sr-copy { margin-top: 22px; }
  .sr-home .sr-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 25px; list-style: none; margin: 0; padding: 0; }
  .sr-home .sr-step-number { display: grid; place-items: center; width: 50px; height: 50px; border: 1px solid #cad8c4; border-radius: 50%; color: #46654b; font-family: Georgia, serif; font-size: 21px; }
  .sr-home .sr-steps h3 { margin-top: 26px; font-size: 15px; font-weight: 600; }
  .sr-home .sr-steps .sr-copy { font-size: 12px; margin-top: 12px; }
  .sr-home .sr-facility-card { position: relative; min-height: 330px; border-radius: 14px; overflow: hidden; background: #315651; color: #fff; }
  .sr-home .sr-facility-card .sr-media { position: absolute; inset: 0; }
  .sr-home .sr-facility-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, #183f3d00 10%, #102d2cc7 70%, #102d2cf0); pointer-events: none; }
  .sr-home .sr-facility-card:hover img { transform: scale(1.045); }
  .sr-home .sr-facility-body { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: flex-end; height: 100%; min-height: 330px; padding: 32px; }
  .sr-home .sr-facility-index { margin-bottom: auto; font-size: 11px; letter-spacing: .12em; opacity: .85; }
  .sr-home .sr-facility-body h3 { margin-top: 45px; font-family: Georgia, serif; font-size: 29px; font-weight: 400; line-height: 1.25; }
  .sr-home .sr-facility-body p { max-width: 380px; margin-top: 10px; font-size: 13px; color: #f1f4ef; }
  .sr-home .sr-facility-body > svg { position: absolute; right: 30px; top: 28px; width: 22px; height: 22px; }
  .sr-home .sr-insurance { padding-block: 32px; background: #fffefb; border-block: 1px solid var(--sr-line); }
  .sr-home .sr-insurance-intro { text-align: center; margin-bottom: 22px; }
  .sr-home .sr-insurance-intro .sr-copy { margin-top: 10px; font-size: 13px; }
  .sr-home .sr-insights { background: #f4f1e9; }
  .sr-home .sr-insight-card .sr-media { height: 230px; }
  .sr-home .sr-insight-card h3 { font-family: Georgia, serif; font-size: 25px; font-weight: 400; }
  .sr-home .sr-read-time { display: flex; align-items: center; gap: 5px; color: var(--sr-muted); font-size: 10px; font-weight: 400; }
  .sr-home .sr-faq-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 100px; }
  .sr-home .sr-faq-intro .sr-heading { margin-top: 18px; }
  .sr-home .sr-faq-intro .sr-copy { margin-top: 22px; max-width: 350px; }
  .sr-home .sr-faq-intro .sr-text-link { margin-top: 16px; }
  .sr-home .sr-faq-list { border-top: 1px solid var(--sr-line); }
  .sr-home .sr-faq-list details { border-bottom: 1px solid var(--sr-line); }
  .sr-home .sr-faq-list summary { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 78px; padding: 20px 0; cursor: pointer; list-style: none; font-size: 15px; font-weight: 500; line-height: 1.5; }
  .sr-home .sr-faq-list summary::-webkit-details-marker { display: none; }
  .sr-home .sr-faq-list summary svg { width: 18px; height: 18px; transition: transform .2s ease; }
  .sr-home .sr-faq-list details[open] summary svg { transform: rotate(45deg); }
  .sr-home .sr-faq-list details > p { padding-bottom: 24px; font-size: 13px; color: var(--sr-muted); line-height: 1.85; }
  .sr-home .sr-faq-list details > p a { text-decoration: underline; text-underline-offset: 3px; }
  .sr-home .sr-final { padding-bottom: 36px; }
  .sr-home .sr-final-panel { position: relative; padding: 70px 36px; border-radius: 18px; background: #183f3d; color: #f8f5ec; text-align: center; overflow: hidden; }
  .sr-home .sr-final-panel::before, .sr-home .sr-final-panel::after { content: ''; position: absolute; width: 420px; height: 420px; border: 1px solid #f0f5e51c; border-radius: 50%; pointer-events: none; }
  .sr-home .sr-final-panel::before { top: -220px; left: -230px; }
  .sr-home .sr-final-panel::after { bottom: -250px; right: -180px; }
  .sr-home .sr-final-panel .sr-kicker { color: #d3dfc4; }
  .sr-home .sr-final-panel .sr-heading { position: relative; color: #fffdf5; margin-top: 20px; font-size: clamp(38px, 4.8vw, 62px); }
  .sr-home .sr-final-panel .sr-heading em { color: #d3dfc4; font-style: normal; }
  .sr-home .sr-final-panel .sr-copy { max-width: 470px; margin: 22px auto 0; color: #d3dfdb; font-size: 14px; }
  .sr-home .sr-final-panel .sr-actions { position: relative; justify-content: center; }
  .sr-home .sr-final-phone { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding: 4px; font-size: 13px; }
  .sr-home .sr-final-phone:hover { text-decoration: underline; text-underline-offset: 5px; }
  .sr-home .sr-endnote { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 14px; padding-top: 27px; color: var(--sr-muted); font-size: 11px; }
  .sr-home .sr-endnote span { display: inline-flex; align-items: center; gap: 7px; }
  .sr-home .sr-empty { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; padding: 30px; border: 1px dashed #c9d4c6; border-radius: 12px; background: #fffefb; color: var(--sr-ink); }
  .sr-home .sr-empty h3 { font-size: 16px; font-weight: 500; }
  .sr-home .sr-empty p { margin-top: 8px; color: var(--sr-muted); font-size: 13px; }
  .sr-home .sr-empty .sr-text-link { flex-shrink: 0; }
  .sr-home .sr-skeleton { min-height: 300px; overflow: hidden; border-radius: 12px; padding: 20px; background: #eef0e8; }
  .sr-home .sr-skeleton-image { height: 170px; border-radius: 8px; background: #dce2d7; }
  .sr-home .sr-skeleton-line { margin-top: 20px; height: 14px; border-radius: 4px; background: #dce2d7; }
  .sr-home .sr-skeleton-line:last-child { width: 65%; margin-top: 12px; }
  .sr-home .sr-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  @media (min-width: 1600px) { .sr-home .sr-hero { padding-top: 100px; } }
  @media (max-width: 1100px) {
    .sr-home .sr-hero-grid { gap: 44px; }
    .sr-home .sr-hero-image { height: 480px; }
    .sr-home .sr-hero-note { left: -12px; }
    .sr-home .sr-about-grid { gap: 48px; }
    .sr-home .sr-grid--four { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sr-home .sr-quick-link { padding: 22px 18px; gap: 12px; }
    .sr-home .sr-journey-grid { grid-template-columns: 1fr; gap: 40px; }
    .sr-home .sr-journey .sr-heading { max-width: 550px; }
    .sr-home .sr-faq-grid { gap: 50px; }
  }
  @media (max-width: 760px) {
    .sr-home .sr-container { width: calc(100% - 40px); }
    .sr-home .sr-section { padding-block: 64px; }
    .sr-home .sr-hero { padding-top: 42px; padding-bottom: 46px; }
    .sr-home .sr-hero-grid { grid-template-columns: 1fr; gap: 38px; }
    .sr-home .sr-hero-title { font-size: clamp(52px, 10vw, 76px); }
    .sr-home .sr-hero-copy { max-width: 520px; }
    .sr-home .sr-hero-art { width: min(460px, 100%); margin-inline: auto; }
    .sr-home .sr-hero-image { height: 470px; }
    .sr-home .sr-hero-note { left: 0; }
    .sr-home .sr-hero-flower { right: 0; }
    .sr-home .sr-quick-links { grid-template-columns: 1fr; }
    .sr-home .sr-quick-link { min-height: 86px; padding: 20px 24px; }
    .sr-home .sr-quick-link + .sr-quick-link { border-left: 0; border-top: 1px solid var(--sr-line); }
    .sr-home .sr-heading-row { flex-direction: column; align-items: flex-start; gap: 17px; margin-bottom: 28px; }
    .sr-home .sr-grid--three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sr-home .sr-about-grid { grid-template-columns: 1fr; gap: 38px; }
    .sr-home .sr-about-visual { max-width: 520px; }
    .sr-home .sr-about-image { height: 420px; }
    .sr-home .sr-faq-grid { grid-template-columns: 1fr; gap: 30px; }
    .sr-home .sr-final { padding-bottom: 26px; }
    .sr-home .sr-final-panel { padding: 55px 24px; }
    .sr-home .sr-endnote { justify-content: center; text-align: center; }
  }
  @media (max-width: 480px) {
    .sr-home .sr-container { width: calc(100% - 36px); }
    .sr-home .sr-hero-title { font-size: clamp(42px, 12vw, 57px); }
    .sr-home .sr-hero-copy { font-size: 14px; }
    .sr-home .sr-kicker { font-size: 9px; letter-spacing: .13em; }
    .sr-home .sr-actions { gap: 16px; }
    .sr-home .sr-hero-image { height: 390px; }
    .sr-home .sr-hero-note { padding: 14px 17px; }
    .sr-home .sr-hero-flower { width: 68px; height: 68px; }
    .sr-home .sr-photo-caption { left: 24px; bottom: 42px; }
    .sr-home .sr-photo-caption p { font-size: 24px; }
    .sr-home .sr-care-tags { gap: 6px; }
    .sr-home .sr-care-tags span { font-size: 10px; padding-inline: 9px; }
    .sr-home .sr-grid--four, .sr-home .sr-grid--three, .sr-home .sr-grid--two { grid-template-columns: 1fr; }
    .sr-home .sr-card .sr-media { height: 220px; }
    .sr-home .sr-doctor-card .sr-media { height: 330px; }
    .sr-home .sr-steps { grid-template-columns: 1fr; gap: 30px; }
    .sr-home .sr-steps li { display: grid; grid-template-columns: 50px 1fr; column-gap: 18px; }
    .sr-home .sr-step-number { grid-row: span 2; }
    .sr-home .sr-steps h3 { margin-top: 2px; }
    .sr-home .sr-steps .sr-copy { grid-column: 2; margin-top: 7px; }
    .sr-home .sr-about-image { height: 340px; border-top-right-radius: 80px; }
    .sr-home .sr-about-note { max-width: 230px; padding: 20px; }
    .sr-home .sr-facility-body { padding: 25px; }
    .sr-home .sr-facility-body h3 { font-size: 27px; }
    .sr-home .sr-empty { padding: 24px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sr-home *, .sr-home *::before, .sr-home *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
    .sr-home .sr-card:hover, .sr-home .sr-button:hover, .sr-home .sr-card:hover .sr-media img, .sr-home .sr-facility-card:hover img { transform: none; }
  }
`;

const CareImage: React.FC<{
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: React.ReactNode;
}> = ({ src, alt, width = 640, height = 480, priority = false, placeholder }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="sr-image-placeholder" role="img" aria-label={`${alt} — image unavailable`}>
        {placeholder || <Heart aria-hidden="true" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

const SectionHeading: React.FC<{
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  to: string;
  linkLabel: string;
}> = ({ id, eyebrow, title, to, linkLabel }) => (
  <div className="sr-heading-row">
    <div>
      <span className="sr-kicker">{eyebrow}</span>
      <h2 id={id} className="sr-display sr-heading">
        {title}
      </h2>
    </div>
    <Link to={to} className="sr-text-link">
      {linkLabel}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  </div>
);

const CollectionContent: React.FC<{
  status: CollectionStatus;
  count: number;
  skeletonCount: number;
  label: string;
  to: string;
  children: React.ReactNode;
}> = ({ status, count, skeletonCount, label, to, children }) => {
  if (status === 'loading') {
    return (
      <>
        <span className="sr-visually-hidden" role="status">
          Loading {label.toLowerCase()}.
        </span>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index} className="sr-skeleton" aria-hidden="true">
            <div className="sr-skeleton-image" />
            <div className="sr-skeleton-line" />
            <div className="sr-skeleton-line" />
          </div>
        ))}
      </>
    );
  }

  if (!count) {
    return (
      <div className="sr-empty" role="status">
        <div>
          <h3>{status === 'error' ? 'A little pause, not a closed door.' : 'There’s more to discover.'}</h3>
          <p>
            {status === 'error'
              ? 'This preview is temporarily unavailable. Please explore the full page or contact our team.'
              : 'Explore the full page for more information, or contact our team for help.'}
          </p>
        </div>
        <Link to={to} className="sr-text-link">
          {label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const [collections, setCollections] = useState<HomeCollections>({
    specialties: { items: [], status: 'loading' },
    treatments: { items: [], status: 'loading' },
    doctors: { items: [], status: 'loading' },
    facilities: { items: [], status: 'loading' },
    insights: { items: [], status: 'loading' },
  });

  useEffect(() => {
    let active = true;

    async function loadCollection<Key extends keyof HomeCollections>(
      key: Key,
      request: () => Promise<HomeCollections[Key]['items']>
    ) {
      try {
        const items = await request();
        if (active) {
          setCollections((previous) => ({ ...previous, [key]: { items, status: 'ready' } }));
        }
      } catch (error) {
        if (active) {
          console.warn(`Unable to load the ${key} homepage preview:`, error);
          setCollections((previous) => ({ ...previous, [key]: { items: [], status: 'error' } }));
        }
      }
    }

    void loadCollection('specialties', async () => {
      const response = await api.get<{ specialties: Specialty[] }>('/specialties?limit=4');
      return (response.specialties || []).slice(0, 4);
    });
    void loadCollection('treatments', async () => {
      const response = await api.get<{ treatments: Treatment[] }>('/treatments?featured=true');
      return (response.treatments || []).slice(0, 6);
    });
    void loadCollection('doctors', async () => {
      const response = await api.get<{ doctors: Doctor[] }>('/doctors?featured=true');
      return (response.doctors || []).slice(0, 4);
    });
    void loadCollection('facilities', async () => {
      const response = await api.get<{ facilities: Facility[] }>('/facilities?limit=4');
      return (response.facilities || []).slice(0, 4);
    });
    void loadCollection('insights', async () => {
      const response = await api.get<{ insights: Insight[] }>('/insights?limit=3');
      return (response.insights || []).slice(0, 3);
    });

    return () => {
      active = false;
    };
  }, []);

  const { specialties, treatments, doctors, facilities, insights } = collections;

  return (
    <div className="sr-home">
      <style>{HOME_STYLES}</style>

      <section className="sr-hero" aria-labelledby="sr-hero-title">
        <div className="sr-container sr-hero-grid">
          <div>
            <span className="sr-kicker">Sreemantha Hospital · Khammam</span>
            <h1 id="sr-hero-title" className="sr-display sr-hero-title">
              A little hope.<br />
              A whole new<br />
              <em>beginning.</em>
            </h1>
            <p className="sr-copy sr-hero-copy">
              {info.subtitle || 'Thoughtful fertility, maternity and newborn care. For every question, every milestone, and every new beginning.'}
            </p>
            <div className="sr-actions">
              <Link to="/book-appointment" className="sr-button">
                <Calendar size={17} aria-hidden="true" />
                Book a consultation
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/doctors" className="sr-text-link">
                Meet our doctors
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="sr-care-tags" aria-label="Our areas of care">
              <span><Sparkles size={13} aria-hidden="true" />Fertility &amp; IVF</span>
              <span><Heart size={13} aria-hidden="true" />Maternity</span>
              <span><Baby size={13} aria-hidden="true" />Newborn care</span>
            </div>
          </div>
          <div className="sr-hero-art">
            <div className="sr-hero-orbit" aria-hidden="true" />
            <div className="sr-hero-image sr-media">
              <CareImage
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=85"
                alt="Illustrative photograph of a healthcare professional providing attentive care"
                width={800}
                height={1000}
                priority
              />
              <div className="sr-photo-caption">
                <span>Science meets compassion</span>
                <p>Care, with a human touch.</p>
              </div>
            </div>
            <div className="sr-hero-flower" aria-hidden="true"><Sparkles /></div>
            <div className="sr-hero-note">
              <span className="sr-note-icon"><Heart size={20} aria-hidden="true" /></span>
              <div><strong>Your story matters.</strong><small>Let’s take the next step, together.</small></div>
            </div>
          </div>
        </div>
      </section>

      <div className="sr-container">
        <nav className="sr-quick-links" aria-label="Patient quick links">
          <Link to="/book-appointment" className="sr-quick-link">
            <span className="sr-quick-icon"><Calendar size={19} aria-hidden="true" /></span>
            <div><strong>Let’s meet</strong><small>Book your first consultation</small></div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/specialties" className="sr-quick-link">
            <span className="sr-quick-icon"><Stethoscope size={20} aria-hidden="true" /></span>
            <div><strong>Find your care</strong><small>Explore our specialties</small></div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <a href={phoneHref} className="sr-quick-link">
            <span className="sr-quick-icon"><Phone size={18} aria-hidden="true" /></span>
            <div><strong>Talk to a real person</strong><small>{phone}</small></div>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <p className="sr-location"><MapPin size={13} aria-hidden="true" />Priyadarshini Degree College Road, Nehru Nagar, Khammam</p>
      </div>

      <section className="sr-section" aria-labelledby="sr-specialties-title">
        <div className="sr-container">
          <SectionHeading
            id="sr-specialties-title"
            eyebrow="Every chapter, thoughtfully cared for"
            title={<>Specialized care.<br /><em>Personal attention.</em></>}
            to="/specialties"
            linkLabel="Explore all specialties"
          />
          <div className="sr-grid sr-grid--four" aria-busy={specialties.status === 'loading'}>
            <CollectionContent
              status={specialties.status}
              count={specialties.items.length}
              skeletonCount={4}
              label="Explore specialties"
              to="/specialties"
            >
              {specialties.items.map((specialty) => (
                <Link key={specialty.id} to={`/specialties/${specialty.slug}`} className="sr-card">
                  <div className="sr-media">
                    <CareImage src={specialty.image_url} alt={specialty.title} placeholder={<Stethoscope aria-hidden="true" />} />
                  </div>
                  <div className="sr-card-body">
                    {specialty.category && <span className="sr-card-category">{specialty.category}</span>}
                    <h3>{specialty.title}</h3>
                    <p className="sr-copy sr-clamp">{specialty.short_description}</p>
                    <span className="sr-card-footer">
                      Discover this specialty
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </CollectionContent>
          </div>
        </div>
      </section>

      <section className="sr-section sr-about" aria-labelledby="sr-about-title">
        <div className="sr-container sr-about-grid">
          <div className="sr-about-visual">
            <div className="sr-about-image sr-media">
              <CareImage
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&auto=format&fit=crop&q=85"
                alt="Illustrative photograph of a clinical team working together"
                width={700}
                height={800}
              />
            </div>
            <div className="sr-about-note">
              <Heart size={22} aria-hidden="true" />
              <p className="sr-display">The little things.<br />The big feelings.</p>
              <p>Room for your questions. Respect for your journey.</p>
            </div>
          </div>
          <div>
            <span className="sr-kicker">A warm welcome to Sreemantha</span>
            <h2 id="sr-about-title" className="sr-display sr-heading">
              More than a hospital.<br /><em>A place to feel understood.</em>
            </h2>
            <p className="sr-copy">
              Starting a family is deeply personal. At Sreemantha Hospital in Khammam, reproductive medicine, obstetric care and neonatology come together with one simple intention: to put you at the heart of your care.
            </p>
            <p className="sr-copy">
              From fertility consultations to maternity and newborn care, our team is here to listen, explain your options, and help you take your next step with greater clarity.
            </p>
            <div className="sr-about-features">
              <div><Check aria-hidden="true" /><span>Fertility care, including IVF, ICSI and IUI</span></div>
              <div><Check aria-hidden="true" /><span>Maternity, neonatal and pediatric care</span></div>
              <div><Check aria-hidden="true" /><span>Cleanroom embryology lab and Level-III NICU</span></div>
            </div>
            <Link to="/about" className="sr-text-link">
              Get to know Sreemantha
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sr-section" aria-labelledby="sr-treatments-title">
        <div className="sr-container">
          <SectionHeading
            id="sr-treatments-title"
            eyebrow="Your options, made clearer"
            title={<>A considered approach<br />to <em>every next step.</em></>}
            to="/treatments"
            linkLabel="Explore treatments"
          />
          <div className="sr-grid sr-grid--three" aria-busy={treatments.status === 'loading'}>
            <CollectionContent
              status={treatments.status}
              count={treatments.items.length}
              skeletonCount={3}
              label="Explore treatments"
              to="/treatments"
            >
              {treatments.items.map((treatment, index) => (
                <Link key={treatment.id} to={`/treatments/${treatment.slug}`} className="sr-card sr-treatment">
                  <div className="sr-treatment-top">
                    <span className="sr-treatment-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {treatment.category && <span className="sr-card-category">{treatment.category}</span>}
                  </div>
                  <h3>{treatment.title}</h3>
                  <p className="sr-copy sr-clamp">{treatment.short_description}</p>
                  {treatment.typical_duration && (
                    <p className="sr-treatment-duration">Typical duration: {treatment.typical_duration}</p>
                  )}
                  <span className="sr-card-footer">
                    Understand your options
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </CollectionContent>
          </div>
        </div>
      </section>

      <section className="sr-section sr-doctors" aria-labelledby="sr-doctors-title">
        <div className="sr-container">
          <SectionHeading
            id="sr-doctors-title"
            eyebrow="The people behind your care"
            title={<>Experienced hands.<br /><em>Reassuring hearts.</em></>}
            to="/doctors"
            linkLabel="Meet the whole team"
          />
          <div className="sr-grid sr-grid--four" aria-busy={doctors.status === 'loading'}>
            <CollectionContent
              status={doctors.status}
              count={doctors.items.length}
              skeletonCount={4}
              label="Meet our doctors"
              to="/doctors"
            >
              {doctors.items.map((doctor) => (
                <Link key={doctor.id} to={`/doctors/${doctor.slug}`} className="sr-card sr-doctor-card">
                  <div className="sr-media">
                    <CareImage
                      src={doctor.photo_url}
                      alt={doctor.name}
                      width={600}
                      height={750}
                      placeholder={<Stethoscope aria-hidden="true" />}
                    />
                    {doctor.department && <span className="sr-doctor-department">{doctor.department}</span>}
                  </div>
                  <div className="sr-card-body">
                    <h3>{doctor.name}</h3>
                    {doctor.designation && <p className="sr-doctor-designation">{doctor.designation}</p>}
                    {doctor.qualifications && <p className="sr-copy">{doctor.qualifications}</p>}
                    <span className="sr-card-footer">
                      <span>
                        {doctor.experience_years != null
                          ? `${doctor.experience_years}+ years of experience`
                          : 'Get to know your specialist'}
                      </span>
                      <span>
                        View profile
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </CollectionContent>
          </div>
        </div>
      </section>

      <section className="sr-section sr-journey" aria-labelledby="sr-journey-title">
        <div className="sr-container sr-journey-grid">
          <div>
            <span className="sr-kicker">We’ll take it one step at a time</span>
            <h2 id="sr-journey-title" className="sr-display sr-heading">
              Big possibilities.<br /><em>A simple first step.</em>
            </h2>
            <p className="sr-copy">You don’t need all the answers before you arrive. That’s what the conversation is for.</p>
          </div>
          <ol className="sr-steps">
            <li>
              <span className="sr-step-number" aria-hidden="true">01</span>
              <h3>Start a conversation</h3>
              <p className="sr-copy">Book a consultation or call us. Tell us what brings you here.</p>
            </li>
            <li>
              <span className="sr-step-number" aria-hidden="true">02</span>
              <h3>Meet your specialist</h3>
              <p className="sr-copy">Share your history, ask your questions, and explore your options.</p>
            </li>
            <li>
              <span className="sr-step-number" aria-hidden="true">03</span>
              <h3>Plan your next step</h3>
              <p className="sr-copy">Discuss a care plan with your doctor, at a pace that feels right for you.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="sr-section" aria-labelledby="sr-facilities-title">
        <div className="sr-container">
          <SectionHeading
            id="sr-facilities-title"
            eyebrow="Thoughtful spaces. Purposeful technology."
            title={<>Behind every detail,<br /><em>your care comes first.</em></>}
            to="/facilities"
            linkLabel="Discover our facilities"
          />
          <div className="sr-grid sr-grid--two" aria-busy={facilities.status === 'loading'}>
            <CollectionContent
              status={facilities.status}
              count={facilities.items.length}
              skeletonCount={2}
              label="Explore facilities"
              to="/facilities"
            >
              {facilities.items.map((facility, index) => (
                <Link key={facility.id} to={`/facilities/${facility.slug}`} className="sr-facility-card">
                  <div className="sr-media">
                    <CareImage
                      src={facility.image_url}
                      alt={facility.name || facility.title || 'Hospital Facility'}
                      width={900}
                      height={600}
                      placeholder={<Building2 aria-hidden="true" />}
                    />
                  </div>
                  <div className="sr-facility-body">
                    <span className="sr-facility-index" aria-hidden="true">
                      OUR SPACES / {String(index + 1).padStart(2, '0')}
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                    <h3>{facility.name}</h3>
                    <p className="sr-clamp">{facility.short_description}</p>
                  </div>
                </Link>
              ))}
            </CollectionContent>
          </div>
        </div>
      </section>

      <section className="sr-insurance" aria-labelledby="sr-insurance-title">
        <div className="sr-container sr-insurance-intro">
          <h2 id="sr-insurance-title" className="sr-kicker">Let’s talk insurance</h2>
          <p className="sr-copy">Ask our team about your insurer, cashless eligibility, and the paperwork for your visit.</p>
        </div>
        <SlidingInsuranceStrip />
      </section>

      <section className="sr-section sr-insights" aria-labelledby="sr-insights-title">
        <div className="sr-container">
          <SectionHeading
            id="sr-insights-title"
            eyebrow="A little knowledge. A little reassurance."
            title={<>Good questions deserve<br /><em>thoughtful answers.</em></>}
            to="/insights"
            linkLabel="Visit our health journal"
          />
          <div className="sr-grid sr-grid--three" aria-busy={insights.status === 'loading'}>
            <CollectionContent
              status={insights.status}
              count={insights.items.length}
              skeletonCount={3}
              label="Read health insights"
              to="/insights"
            >
              {insights.items.map((insight) => (
                <Link key={insight.id} to={`/insights/${insight.slug}`} className="sr-card sr-insight-card">
                  <div className="sr-media">
                    <CareImage src={insight.image_url} alt={insight.title} placeholder={<BookOpen aria-hidden="true" />} />
                  </div>
                  <div className="sr-card-body">
                    {insight.category && <span className="sr-card-category">{insight.category}</span>}
                    <h3>{insight.title}</h3>
                    <p className="sr-copy sr-clamp">{insight.summary}</p>
                    <span className="sr-card-footer">
                      <span className="sr-read-time">
                        {insight.read_time && (
                          <>
                            <Clock size={13} aria-hidden="true" />
                            {insight.read_time}
                          </>
                        )}
                      </span>
                      <span>
                        Read the story
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </CollectionContent>
          </div>
        </div>
      </section>

      <section className="sr-section" aria-labelledby="sr-faq-title">
        <div className="sr-container sr-faq-grid">
          <div className="sr-faq-intro">
            <span className="sr-kicker">Before we meet</span>
            <h2 id="sr-faq-title" className="sr-display sr-heading">
              A few things<br /><em>you might wonder.</em>
            </h2>
            <p className="sr-copy">Have something else on your mind? Our team can help you find the right person to talk to.</p>
            <a href={phoneHref} className="sr-text-link">
              <Phone size={16} aria-hidden="true" />
              Give us a call
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="sr-faq-list">
            <details>
              <summary>How can I book a consultation?<Plus aria-hidden="true" /></summary>
              <p>
                Use our <Link to="/book-appointment">appointment page</Link> to request a consultation, or call{' '}
                <a href={phoneHref}>{phone}</a> to speak with the hospital team about availability.
              </p>
            </details>
            <details>
              <summary>Which specialist should I see?<Plus aria-hidden="true" /></summary>
              <p>
                Explore our <Link to="/specialties">specialties</Link> and <Link to="/doctors">doctor profiles</Link>, or call our team and describe the type of care you’re looking for. They can help direct your inquiry.
              </p>
            </details>
            <details>
              <summary>What should I bring to my first visit?<Plus aria-hidden="true" /></summary>
              <p>
                Bring your previous medical records, recent reports, and insurance documents if applicable. When booking, ask our team whether your appointment needs any additional documents or preparation.
              </p>
            </details>
            <details>
              <summary>Can I check my insurance before visiting?<Plus aria-hidden="true" /></summary>
              <p>
                Yes, contact the hospital team to discuss your insurer and required paperwork. Coverage and cashless approvals depend on your policy and the care you need, so please confirm eligibility before your visit.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="sr-final" aria-labelledby="sr-final-title">
        <div className="sr-container">
          <div className="sr-final-panel">
            <span className="sr-kicker">Whenever you’re ready</span>
            <h2 id="sr-final-title" className="sr-display sr-heading">
              Your next chapter starts<br />with <em>a conversation.</em>
            </h2>
            <p className="sr-copy">
              A question, a possibility, a new beginning. We’re here to listen and help you explore what comes next.
            </p>
            <div className="sr-actions">
              <Link to="/book-appointment" className="sr-button sr-button--light">
                <Calendar size={17} aria-hidden="true" />
                Let’s book your visit
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a href={phoneHref} className="sr-final-phone">
                <Phone size={16} aria-hidden="true" />
                {phone}
              </a>
            </div>
          </div>
          <div className="sr-endnote">
            <span><MapPin size={13} aria-hidden="true" />Sreemantha Hospital · Khammam</span>
            <span><ShieldCheck size={13} aria-hidden="true" />Thoughtful care. Personal attention.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
