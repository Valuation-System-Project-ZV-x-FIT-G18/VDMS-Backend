--
-- PostgreSQL database dump
--


-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: documents_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.documents_status_enum AS ENUM (
    'pending',
    'submitted',
    'approved',
    'rejected'
);


--
-- Name: invoices_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invoices_status_enum AS ENUM (
    'Overdue',
    'Pending',
    'Paid'
);


--
-- Name: notifications_event_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notifications_event_enum AS ENUM (
    'PROJECT_CREATED',
    'DOCUMENT_MISSING',
    'DOCUMENT_UPLOADED',
    'REPORT_PREPARED',
    'PROJECT_COMPLETED',
    'PAYMENT_DUE',
    'STAGE_CHANGED'
);


--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'success',
    'warning',
    'error',
    'info'
);


--
-- Name: projects_payment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.projects_payment_status_enum AS ENUM (
    'Paid',
    'Pending'
);


--
-- Name: projects_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.projects_status_enum AS ENUM (
    'Site Inspected',
    'Awaiting Docs',
    'Completed',
    'Payment Pending',
    'Report Prepared',
    'In Progress'
);


--
-- Name: team_members_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.team_members_role_enum AS ENUM (
    'coordinator',
    'Technical officer',
    'Manager',
    'Senior Valuator',
    'Valuator'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'coordinator',
    'technical_officer',
    'l1_manager',
    'l2_manager',
    'l3_manager',
    'bank',
    'loan_applicant'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assigned_to; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assigned_to (
    id integer NOT NULL,
    to_id character varying NOT NULL,
    time_date timestamp without time zone NOT NULL,
    project_id character varying NOT NULL,
    loan_applicant_nic character varying,
    property_address character varying
);


--
-- Name: assigned_to_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assigned_to_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assigned_to_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assigned_to_id_seq OWNED BY public.assigned_to.id;


--
-- Name: bank_officers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_officers (
    officer_id character varying(6) NOT NULL,
    designation character varying,
    user_id character varying(6)
);


--
-- Name: bank_project_officer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_project_officer (
    id integer NOT NULL,
    bank_id character varying(6),
    project_id character varying(6),
    officer_id character varying(6)
);


--
-- Name: bank_project_officer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bank_project_officer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bank_project_officer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bank_project_officer_id_seq OWNED BY public.bank_project_officer.id;


--
-- Name: banks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banks (
    bank_id character varying(6) NOT NULL,
    bank_name character varying NOT NULL,
    branch character varying NOT NULL,
    branch_code character varying NOT NULL
);


--
-- Name: document_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_uploads (
    document_id character varying(6) NOT NULL,
    nic_file_name character varying,
    nic_file_path character varying,
    tax_file_name character varying,
    tax_file_path character varying,
    utility_file_name character varying,
    utility_file_path character varying,
    other_file_name character varying,
    other_file_path character varying,
    uploaded_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying(6)
);


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    status public.documents_status_enum DEFAULT 'pending'::public.documents_status_enum NOT NULL,
    file_url character varying,
    uploaded_by character varying,
    required boolean DEFAULT false NOT NULL,
    note text,
    project_id uuid NOT NULL,
    upload_date timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: free; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.free (
    id integer NOT NULL,
    to_id character varying NOT NULL
);


--
-- Name: free_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.free_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: free_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.free_id_seq OWNED BY public.free.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id character varying NOT NULL,
    project_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    due_date date NOT NULL,
    status public.invoices_status_enum DEFAULT 'Pending'::public.invoices_status_enum NOT NULL,
    payment_proof_file_name character varying,
    payment_proof_uploaded_at timestamp without time zone,
    coordinator_notified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: legal_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legal_details (
    legal_id character varying(6) NOT NULL,
    deed_number character varying NOT NULL,
    deed_type character varying NOT NULL,
    registration_date date NOT NULL,
    notary_details character varying NOT NULL,
    ownership_type character varying NOT NULL,
    usage_regulations text,
    file_path character varying,
    user_id character varying(6)
);


--
-- Name: loan_applicants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loan_applicants (
    loan_applicant_id character varying(6) NOT NULL,
    user_id character varying(6)
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.notifications_type_enum DEFAULT 'info'::public.notifications_type_enum NOT NULL,
    event public.notifications_event_enum NOT NULL,
    title character varying NOT NULL,
    message text,
    recipient_id character varying NOT NULL,
    recipient_role character varying NOT NULL,
    project_id uuid,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: on_leave; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.on_leave (
    id integer NOT NULL,
    to_id character varying NOT NULL,
    reason_for_leave character varying NOT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL
);


--
-- Name: on_leave_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.on_leave_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: on_leave_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.on_leave_id_seq OWNED BY public.on_leave.id;


--
-- Name: project_loan_applicant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_loan_applicant (
    id integer NOT NULL,
    project_id character varying(6),
    loan_applicant_id character varying(6)
);


--
-- Name: project_loan_applicant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_loan_applicant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_loan_applicant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_loan_applicant_id_seq OWNED BY public.project_loan_applicant.id;


--
-- Name: project_valuation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_valuation (
    id integer NOT NULL,
    valuation_id integer NOT NULL,
    project_id character varying(6),
    assigned_to_id integer
);


--
-- Name: project_valuation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_valuation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_valuation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_valuation_id_seq OWNED BY public.project_valuation.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id character varying NOT NULL,
    property_address character varying NOT NULL,
    applicant character varying,
    status public.projects_status_enum DEFAULT 'In Progress'::public.projects_status_enum NOT NULL,
    requested_date date NOT NULL,
    expected_completion date NOT NULL,
    payment_status public.projects_payment_status_enum DEFAULT 'Pending'::public.projects_payment_status_enum NOT NULL,
    client_id character varying,
    user_id character varying(6),
    bank_id character varying(6),
    bank_officer_id character varying(6),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    property_id character varying(6) NOT NULL,
    address character varying NOT NULL,
    city character varying NOT NULL,
    district character varying NOT NULL,
    province character varying NOT NULL,
    local_authority character varying NOT NULL,
    land_type character varying NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    user_id character varying(6)
);


--
-- Name: rejected; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rejected (
    id integer NOT NULL,
    to_id character varying NOT NULL,
    reason_for_reject character varying NOT NULL
);


--
-- Name: rejected_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rejected_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rejected_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rejected_id_seq OWNED BY public.rejected.id;


--
-- Name: survey_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.survey_plans (
    survey_id character varying(6) NOT NULL,
    plan_number character varying NOT NULL,
    surveyor_name character varying NOT NULL,
    boundary_details text NOT NULL,
    lot_number character varying NOT NULL,
    land_shape character varying NOT NULL,
    file_path character varying,
    user_id character varying(6)
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    role public.team_members_role_enum NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    project_id uuid NOT NULL
);


--
-- Name: technical_officers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.technical_officers (
    to_id character varying(6) NOT NULL,
    name character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    name_with_initials character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    nic character varying NOT NULL,
    dob date NOT NULL,
    city character varying(120)
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id character varying(6) NOT NULL,
    nic character varying(12) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.users_role_enum NOT NULL,
    full_name character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    name_with_initials character varying NOT NULL,
    date_of_birth date,
    phone character varying(15) NOT NULL,
    street_address character varying NOT NULL,
    city character varying NOT NULL,
    district character varying NOT NULL,
    province character varying NOT NULL,
    postal_code character varying,
    registered_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: valuation_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.valuation_projects (
    project_id character varying(6) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying(6)
);


--
-- Name: assigned_to id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assigned_to ALTER COLUMN id SET DEFAULT nextval('public.assigned_to_id_seq'::regclass);


--
-- Name: bank_project_officer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_project_officer ALTER COLUMN id SET DEFAULT nextval('public.bank_project_officer_id_seq'::regclass);


--
-- Name: free id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.free ALTER COLUMN id SET DEFAULT nextval('public.free_id_seq'::regclass);


--
-- Name: on_leave id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.on_leave ALTER COLUMN id SET DEFAULT nextval('public.on_leave_id_seq'::regclass);


--
-- Name: project_loan_applicant id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant ALTER COLUMN id SET DEFAULT nextval('public.project_loan_applicant_id_seq'::regclass);


--
-- Name: project_valuation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_valuation ALTER COLUMN id SET DEFAULT nextval('public.project_valuation_id_seq'::regclass);


--
-- Name: rejected id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejected ALTER COLUMN id SET DEFAULT nextval('public.rejected_id_seq'::regclass);


--
-- Name: technical_officers PK_191ec2f14b5b8cabc4c8e585e45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.technical_officers
    ADD CONSTRAINT "PK_191ec2f14b5b8cabc4c8e585e45" PRIMARY KEY (to_id);


--
-- Name: bank_officers PK_411d46b7038ed886f8a7c55c22b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_officers
    ADD CONSTRAINT "PK_411d46b7038ed886f8a7c55c22b" PRIMARY KEY (officer_id);


--
-- Name: project_valuation PK_4344d99f2574290d4252d263467; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_valuation
    ADD CONSTRAINT "PK_4344d99f2574290d4252d263467" PRIMARY KEY (id);


--
-- Name: banks PK_45bb03bf8824b79e0484e62b25e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT "PK_45bb03bf8824b79e0484e62b25e" PRIMARY KEY (bank_id);


--
-- Name: projects PK_6271df0a7aed1d6c0691ce6ac50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY (id);


--
-- Name: invoices PK_668cef7c22a427fd822cc1be3ce; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY (id);


--
-- Name: loan_applicants PK_68b3d10155f23ab455be432c7b7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_applicants
    ADD CONSTRAINT "PK_68b3d10155f23ab455be432c7b7" PRIMARY KEY (loan_applicant_id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: valuation_projects PK_6b028b65eb1dc51cbe41a5d00e4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valuation_projects
    ADD CONSTRAINT "PK_6b028b65eb1dc51cbe41a5d00e4" PRIMARY KEY (project_id);


--
-- Name: rejected PK_7c940345cc41244748c7308acab; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejected
    ADD CONSTRAINT "PK_7c940345cc41244748c7308acab" PRIMARY KEY (id);


--
-- Name: bank_project_officer PK_80e1fe7bd62980738dbeae4fff4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_project_officer
    ADD CONSTRAINT "PK_80e1fe7bd62980738dbeae4fff4" PRIMARY KEY (id);


--
-- Name: assigned_to PK_89cc1dde178a9c2fefa836f39cc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assigned_to
    ADD CONSTRAINT "PK_89cc1dde178a9c2fefa836f39cc" PRIMARY KEY (id);


--
-- Name: users PK_96aac72f1574b88752e9fb00089; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY (user_id);


--
-- Name: legal_details PK_9c12d1d5762a5941eca6402f971; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_details
    ADD CONSTRAINT "PK_9c12d1d5762a5941eca6402f971" PRIMARY KEY (legal_id);


--
-- Name: survey_plans PK_a96f8ad1d4fb56a49872b24fc40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_plans
    ADD CONSTRAINT "PK_a96f8ad1d4fb56a49872b24fc40" PRIMARY KEY (survey_id);


--
-- Name: documents PK_ac51aa5181ee2036f5ca482857c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY (id);


--
-- Name: properties PK_b3fea131924b6a50785b0f4ce6d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT "PK_b3fea131924b6a50785b0f4ce6d" PRIMARY KEY (property_id);


--
-- Name: free PK_b82e4f0fc6278db6a36aa9bcb68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.free
    ADD CONSTRAINT "PK_b82e4f0fc6278db6a36aa9bcb68" PRIMARY KEY (id);


--
-- Name: document_uploads PK_ba2f377a6503eb649b36cb96c27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_uploads
    ADD CONSTRAINT "PK_ba2f377a6503eb649b36cb96c27" PRIMARY KEY (document_id);


--
-- Name: project_loan_applicant PK_bb2572f83dca5b4f2015916e070; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant
    ADD CONSTRAINT "PK_bb2572f83dca5b4f2015916e070" PRIMARY KEY (id);


--
-- Name: team_members PK_ca3eae89dcf20c9fd95bf7460aa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY (id);


--
-- Name: on_leave PK_e663c2046ec8a76123f1aea0a3a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.on_leave
    ADD CONSTRAINT "PK_e663c2046ec8a76123f1aea0a3a" PRIMARY KEY (id);


--
-- Name: project_loan_applicant REL_57aae6369de6c5ebfd91826a79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant
    ADD CONSTRAINT "REL_57aae6369de6c5ebfd91826a79" UNIQUE (project_id);


--
-- Name: project_loan_applicant REL_94b129bc3ac86c0ea9be65f62c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant
    ADD CONSTRAINT "REL_94b129bc3ac86c0ea9be65f62c" UNIQUE (loan_applicant_id);


--
-- Name: loan_applicants REL_d35111f3dee803132353e41ebf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_applicants
    ADD CONSTRAINT "REL_d35111f3dee803132353e41ebf" UNIQUE (user_id);


--
-- Name: technical_officers UQ_24d21e5691bf6de8e8d61b35458; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.technical_officers
    ADD CONSTRAINT "UQ_24d21e5691bf6de8e8d61b35458" UNIQUE (email);


--
-- Name: users UQ_6988f854629846c6a59c749dab9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_6988f854629846c6a59c749dab9" UNIQUE (nic);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: invoices UQ_a62eb88a23934fb83945c3e58af; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "UQ_a62eb88a23934fb83945c3e58af" UNIQUE (invoice_id);


--
-- Name: projects UQ_b3613537a59b41f5811258edf99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "UQ_b3613537a59b41f5811258edf99" UNIQUE (project_id);


--
-- Name: technical_officers UQ_ff5071eca4794cfc7f5b0303c1e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.technical_officers
    ADD CONSTRAINT "UQ_ff5071eca4794cfc7f5b0303c1e" UNIQUE (nic);


--
-- Name: rejected FK_1cbee19990496f72180ef7ee85b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejected
    ADD CONSTRAINT "FK_1cbee19990496f72180ef7ee85b" FOREIGN KEY (to_id) REFERENCES public.technical_officers(to_id);


--
-- Name: project_loan_applicant FK_57aae6369de6c5ebfd91826a796; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant
    ADD CONSTRAINT "FK_57aae6369de6c5ebfd91826a796" FOREIGN KEY (project_id) REFERENCES public.valuation_projects(project_id);


--
-- Name: survey_plans FK_63efa4f78461e1551e1a8a62950; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_plans
    ADD CONSTRAINT "FK_63efa4f78461e1551e1a8a62950" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: document_uploads FK_72525787fc3edab1ce5dc0b7577; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_uploads
    ADD CONSTRAINT "FK_72525787fc3edab1ce5dc0b7577" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: assigned_to FK_78852d0b77343c26f32295d6c4d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assigned_to
    ADD CONSTRAINT "FK_78852d0b77343c26f32295d6c4d" FOREIGN KEY (to_id) REFERENCES public.technical_officers(to_id);


--
-- Name: bank_officers FK_8e1b25bf253ff703e36bfaa9e8f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_officers
    ADD CONSTRAINT "FK_8e1b25bf253ff703e36bfaa9e8f" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: team_members FK_8fc7868d38fb2f3c63ab17d803e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "FK_8fc7868d38fb2f3c63ab17d803e" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: bank_project_officer FK_948905fe01d9f7a7129978592c1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_project_officer
    ADD CONSTRAINT "FK_948905fe01d9f7a7129978592c1" FOREIGN KEY (project_id) REFERENCES public.valuation_projects(project_id);


--
-- Name: project_loan_applicant FK_94b129bc3ac86c0ea9be65f62cd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_loan_applicant
    ADD CONSTRAINT "FK_94b129bc3ac86c0ea9be65f62cd" FOREIGN KEY (loan_applicant_id) REFERENCES public.loan_applicants(loan_applicant_id);


--
-- Name: notifications FK_95464140d7dc04d7efb0afd6be0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_95464140d7dc04d7efb0afd6be0" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: invoices FK_9ba18dbe4ea525518c4b32df4b6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_9ba18dbe4ea525518c4b32df4b6" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: free FK_a06233803a939d6d659538ee471; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.free
    ADD CONSTRAINT "FK_a06233803a939d6d659538ee471" FOREIGN KEY (to_id) REFERENCES public.technical_officers(to_id);


--
-- Name: on_leave FK_a649b2b2c80fce2bda416ccccb9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.on_leave
    ADD CONSTRAINT "FK_a649b2b2c80fce2bda416ccccb9" FOREIGN KEY (to_id) REFERENCES public.technical_officers(to_id);


--
-- Name: bank_project_officer FK_abb17aad54a47f0b76939a76db3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_project_officer
    ADD CONSTRAINT "FK_abb17aad54a47f0b76939a76db3" FOREIGN KEY (bank_id) REFERENCES public.banks(bank_id);


--
-- Name: project_valuation FK_c40ff07fe5564b9bbb4390775f2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_valuation
    ADD CONSTRAINT "FK_c40ff07fe5564b9bbb4390775f2" FOREIGN KEY (assigned_to_id) REFERENCES public.assigned_to(id);


--
-- Name: legal_details FK_c63272967c7f6bf51fc8de1834b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_details
    ADD CONSTRAINT "FK_c63272967c7f6bf51fc8de1834b" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: properties FK_cea2dfaff2198bf6a43447f7056; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT "FK_cea2dfaff2198bf6a43447f7056" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: loan_applicants FK_d35111f3dee803132353e41ebf5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_applicants
    ADD CONSTRAINT "FK_d35111f3dee803132353e41ebf5" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: valuation_projects FK_d66eac57cb683dc80c9e2553584; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valuation_projects
    ADD CONSTRAINT "FK_d66eac57cb683dc80c9e2553584" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: documents FK_e156b298c20873e14c362e789bf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "FK_e156b298c20873e14c362e789bf" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_valuation FK_e4dfeb1789bb9a75af22c4fe27e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_valuation
    ADD CONSTRAINT "FK_e4dfeb1789bb9a75af22c4fe27e" FOREIGN KEY (project_id) REFERENCES public.valuation_projects(project_id);


--
-- Name: bank_project_officer FK_f09788de5a2d787fad9478feed1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_project_officer
    ADD CONSTRAINT "FK_f09788de5a2d787fad9478feed1" FOREIGN KEY (officer_id) REFERENCES public.bank_officers(officer_id);


--
-- PostgreSQL database dump complete
--


