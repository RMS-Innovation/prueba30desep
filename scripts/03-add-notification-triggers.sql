-- Add notification triggers to existing tables

-- Trigger for enrollment notifications
CREATE OR REPLACE FUNCTION notify_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- This would typically call a webhook or queue a notification
  -- For now, we'll just insert a notification record
  INSERT INTO notifications (user_id, type, channel, status, data, created_at)
  VALUES (
    NEW.user_id,
    'enrollment',
    'pending',
    'pending',
    json_build_object('course_id', NEW.course_id),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollment_notification_trigger
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION notify_enrollment();

-- Trigger for course completion notifications
CREATE OR REPLACE FUNCTION notify_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if course is completed (100% progress)
  IF NEW.progress_percentage = 100 AND OLD.progress_percentage < 100 THEN
    INSERT INTO notifications (user_id, type, channel, status, data, created_at)
    VALUES (
      NEW.user_id,
      'completion',
      'pending',
      'pending',
      json_build_object('course_id', NEW.course_id),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER completion_notification_trigger
  AFTER UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION notify_completion();

-- Trigger for certificate notifications
CREATE OR REPLACE FUNCTION notify_certificate()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, channel, status, data, created_at)
  VALUES (
    NEW.user_id,
    'certificate',
    'pending',
    'pending',
    json_build_object('certificate_id', NEW.id, 'course_id', NEW.course_id),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certificate_notification_trigger
  AFTER INSERT ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION notify_certificate();

-- Trigger for payment notifications
CREATE OR REPLACE FUNCTION notify_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO notifications (user_id, type, channel, status, data, created_at)
    VALUES (
      NEW.user_id,
      'payment',
      'pending',
      'pending',
      json_build_object('payment_id', NEW.id, 'amount', NEW.amount),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_notification_trigger
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment();
