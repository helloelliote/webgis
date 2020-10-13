CREATE TABLE wtt_wser_ma
(
    id      SERIAL    NOT NULL
        CONSTRAINT wtt_wser_ma_pkey
            PRIMARY KEY,
    geom    GEOMETRY(Point, 5187),
    rcv_num INTEGER   NOT NULL,
    rcv_ymd TIMESTAMP NOT NULL,
    rcv_nam VARCHAR NOT NULL,
    apl_hjd CHAR(10)  NOT NULL,
    apl_adr VARCHAR,
    apl_exp VARCHAR,
    apl_cde CHAR(6)   NOT NULL,
    pip_dip INTEGER,
    lep_cde CHAR(6) DEFAULT NULL::BPCHAR,
    apm_nam VARCHAR   NOT NULL,
    apm_adr VARCHAR   NOT NULL,
    apm_tel VARCHAR   NOT NULL,
    dur_ymd TIMESTAMP,
    pro_cde CHAR(6) DEFAULT 'PRO001'::BPCHAR,
    pro_exp VARCHAR,
    pro_ymd TIMESTAMP,
    pro_nam VARCHAR   NOT NULL,
    opr_nam VARCHAR,
    eddate  TIMESTAMP
);

ALTER TABLE wtt_wser_ma
    OWNER TO postgres;

-- INSERT INTO wtt_wser_ma
-- VALUES (DEFAULT,
--         ST_SetSRID(ST_MakePoint(129.3278981, 35.7707244), 5187),
--         date_part('year', CURRENT_DATE),
--         '2020-10-11 17:13',
--         '박영근',
--         '4713025935',
--         '479',
--         '이러쿵 저러쿵해서 500.0L 손실',
--         (SELECT codeno FROM private.cd_apy WHERE cname = '도로 누수'),
--         100,
--         (SELECT codeno FROM private.cd_lep WHERE cname = '관체(이형관/새들)'),
--         '홍길동',
--         '경상북도 경주시 외동읍 신계리 479/경상북도 경주시 신계상신길  23-19 상신빌라 201호',
--         '010-2322-3023',
--         NULL,
--         DEFAULT,
--         NULL,
--         NULL,
--         '박영근',
--         NULL,
--         DEFAULT);

CREATE OR REPLACE FUNCTION rcv_num_reset_year() RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    seqname TEXT := 'seq_' || date_part('year', CURRENT_DATE);
BEGIN
    IF seqname IS NOT NULL THEN
        EXECUTE 'CREATE SEQUENCE IF NOT EXISTS ' || seqname;
        EXECUTE 'SELECT nextval($1)' INTO NEW.rcv_num USING seqname::REGCLASS;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER rcv_num_reset
    BEFORE INSERT
    ON wtt_wser_ma
    FOR EACH ROW
EXECUTE PROCEDURE rcv_num_reset_year();
