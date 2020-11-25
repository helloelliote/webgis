CREATE OR REPLACE FUNCTION dj_yearly_counter() RETURNS INT AS
$$
DECLARE
    current_year    CHAR(4);
    current_rcv_num INT;
    new_rcv_num     INT;
BEGIN
    current_rcv_num = rcv_num FROM wtt_wser_ma ORDER BY id DESC LIMIT 1;
    current_year = LEFT(CAST(current_rcv_num AS CHAR), 4);

    IF current_year = CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS CHAR)
    THEN
        new_rcv_num = current_rcv_num + 1;
    ELSE
        new_rcv_num = CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '000001');
    END IF;

    RETURN CAST(new_rcv_num AS INT);
END;
$$ LANGUAGE plpgsql;
